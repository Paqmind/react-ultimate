import {append, assoc, reject} from "ramda";
import UUID from "node-uuid";
import api from "shared/api/monster";
import {Monster} from "shared/types/monster";
import {parseAs} from "shared/parsers";
import state from "frontend/state";
import {router} from "frontend/router";
import ajax from "frontend/ajax";

let urlCursor = state.select("url");
let dataCursor = state.select(api.plural);
let itemsCursor = dataCursor.select("items");

// Object -> Maybe Monster
export default function addItem(data) {
  console.debug(api.plural + `.addItem(...)`);

  data = assoc("id", data.id || UUID.v4(), data);
  let item = parseAs(Monster, data);
  let id = item.id;

  // Optimistic update
  dataCursor.apply("total", t => t + 1);
  itemsCursor.set(id, item);

  if (dataCursor.get("fullLoad")) {
    // Inject new id at whatever place
    dataCursor.apply("pagination", pp => append(id, pp));
  } else {
    // Pagination is messed up, do reset
    dataCursor.merge({
      total: 0,
      pagination: [],
    });
  }

  if (urlCursor.get("route") == api.singular + "-add") {
    setImmediate(() => {
      router.transitionTo(api.singular + "-detail", {id: item.id});
    });
  }

  return ajax.put(api.itemUrl.replace(":id", id), item)
    .then(response => {
      let {total, items, pagination} = dataCursor.get();
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = itemsCursor.set(id, parseAs(Monster, response.data.data));
        }
        return item;
      } else {
        itemsCursor.unset(id);
        dataCursor.apply("total", t => t ? t - 1 : t);
        dataCursor.apply("pagination", pp => reject(id => id == item.id, pp));
        throw Error(response.statusText);
      }
    });
}
