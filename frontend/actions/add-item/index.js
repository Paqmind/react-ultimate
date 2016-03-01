import {append, assoc, reject} from "ramda";
import UUID from "node-uuid";
import {parseAs} from "shared/parsers";
import state from "frontend/state";
import ajax from "frontend/ajax";
import {router} from "frontend/router";

let urlCursor = state.select("url");

// Cursor, Cursor, Type, api -> Promise
export default function addItem(DBCursor, UICursor, Type, api) {
  console.debug(api.plural + `.addItem(...)`);

  let data = UICursor.get("addForm");
  data = assoc("id", data.id || UUID.v4(), data);
  let item = parseAs(Type, data);
  let id = item.id;

  // Optimistic update
  UICursor.apply("total", t => t + 1);
  DBCursor.set(id, item);

  if (UICursor.get("fullLoad")) {
    // Inject new id at whatever place
    UICursor.apply("ids", ps => append(id, ps));
  } else {
    // Pagination is messed up, do reset
    UICursor.merge({
      total: 0,
      ids: [],
    });
  }

  if (urlCursor.get("route") == api.singular + "-add") {
    setImmediate(() => {
      router.transitionTo(api.singular + "-detail", {id: item.id});
    });
  }

  return ajax.put(api.itemUrl.replace(":id", id), item)
    .then(response => {
      let {total, items, ids} = UICursor.get();
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = DBCursor.set(id, parseAs(Type, response.data.data));
        }
        return item;
      } else {
        DBCursor.unset(id);
        UICursor.apply("total", t => t ? t - 1 : t);
        UICursor.apply("ids", ps => reject(id => id == item.id, ps));
        throw Error(response.statusText);
      }
    });
}
