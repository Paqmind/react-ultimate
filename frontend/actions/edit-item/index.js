import state from "frontend/state";
import ajax from "frontend/ajax";
import {parseAs} from "shared/parsers";


// Cursor, Type, Api -> Promise
export default function _editItem(UICursor, Type, api) {
  let data = UICursor.get("editForm");
  console.debug(api.singular + `.editItem(${data.id})`);

   let DBCursor = state.select("DB", UICursor.get("DBCursorName"));

  let item = parseAs(Type, data);
  let id = item.id;

  // Optimistic update
  let oldItem = DBCursor.get(id);
  DBCursor.set(id, item);

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
        DBCursor.set(id, oldItem);
        throw Error(response.statusText);
      }
    });
}
