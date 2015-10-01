import {append, assoc, reject} from "ramda";
import UUID from "node-uuid";
import api from "shared/api/monster";
import {Monster} from "shared/types/monster";
import {parseAs} from "shared/parsers";
import state from "frontend/state";
import {router} from "frontend/router";
import ajax from "frontend/ajax";

let url$ = state.select("url");
let data$ = state.select(api.plural);
let items$ = data$.select("items");

// Object -> Maybe Monster
export default function addItem(data) {
  console.debug(api.plural + `.addItem(...)`);

  data = assoc("id", data.id || UUID.v4(), data);
  let item = parseAs(data, Monster);
  let id = item.id;

  // Optimistic update
  data$.apply("total", t => t + 1);
  items$.set(id, item);

  if (data$.get("fullLoad")) {
    // Inject new id at whatever place
    data$.apply("pagination", pp => append(id, pp));
  } else {
    // Pagination is messed up, do reset
    data$.set("total", 0);
    data$.set("pagination", []);
  }

  if (url$.get("route") == api.singular + "-add") {
    setImmediate(() => {
      router.transitionTo(api.singular + "-detail", {id: item.id});
    });
  }

  return ajax.put(api.itemUrl.replace(":id", id), item)
    .then(response => {
      let {total, items, pagination} = data$.get();
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = items$.set(id, Monster(response.data.data));
        }
        return item;
      } else {
        items$.unset(id);
        data$.apply("total", t => t ? t - 1 : t);
        data$.apply("pagination", pp => reject(id => id == item.id, pp));
        throw Error(response.statusText);
      }
    });
}
