import {append, assoc, reject} from "ramda";
import UUID from "node-uuid";
import state from "frontend/state";
import ajax from "frontend/ajax";
import {parseAs} from "shared/parsers";


// Cursor, Type, Api -> Promise
export default function _addItem(UICursor, Type, api) {
  let data = UICursor.get("addForm");
  console.debug(api.singular + `.addItem(...)`);

  let DBCursor = state.select("DB", UICursor.get("DBCursorName"));

  data = assoc("id", data.id || UUID.v4(), data);
  let item = parseAs(Type, data);
  let id = item.id;

  // Optimistic update
  DBCursor.set(id, item);
  UICursor.set("id", id);

  return ajax.put(api.itemUrl.replace(":id", id), item)
    .then(response => {
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = DBCursor.set(id, parseAs(Type, response.data.data));
          DBCursor.set(id, item);
        } else {
          // what here?
        }
      } else {
        DBCursor.unset(id);
        throw Error(response.statusText);
      }
    });
}
