import {append, assoc, reject} from "ramda";
import UUID from "node-uuid";
import api from "shared/api/robot";
import {Robot} from "shared/types";
import {parseAs} from "shared/parsers";
import state from "frontend/state";
import {router} from "frontend/router";
import ajax from "frontend/ajax";

let urlCursor = state.select("url");
let dataCursor = state.select(api.plural);
let itemsCursor = dataCursor.select("items");

// Object -> Promise Robot
export default function addItem(data) {
  console.debug(api.plural + `.addItem(...)`);

  data = assoc("id", data.id || UUID.v4(), data);
  let item = parseAs(Robot, data);
  let id = item.id;

  // Optimistic update
  itemsCursor.set(id, item);

  if (dataCursor.get("fullLoad")) {
    // Inject new id at whatever place
    dataCursor.apply("pagination", ps => append(id, ps));
  } else {
    // Pagination is messed up, do reset
    dataCursor.merge({
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
      let {items, pagination} = dataCursor.get();
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = itemsCursor.set(id, parseAs(Robot, response.data.data));
        }
        return item;
      } else {
        itemsCursor.unset(id);
        dataCursor.apply("pagination", ps => reject(id => id == item.id, ps));
        throw Error(response.statusText);
      }
    });
}
