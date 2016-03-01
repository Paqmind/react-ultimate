import {parseAs} from "shared/parsers";
import state from "frontend/state";
import ajax from "frontend/ajax";

// Cursor, Cursor, Type, api -> Promise
export default function editItem(DBCursor, UICursor, Type, api) {

  let data = UICursor.get("editForm");

  console.debug(api.plural + `.editItem(${data.id})`);

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
        }
        return item;
      } else {
        DBCursor.set(id, oldItem);
        throw Error(response.statusText);
      }
    });
}
