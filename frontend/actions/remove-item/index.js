import ajax from "frontend/ajax";
import state from "frontend/state";
import api from "shared/api/robot";


// Cursor, Type, Api, id -> Promise
export default function _removeItem(UICursor, Type, api, id) {
  console.debug(api.singular + `.removeItem()`);

  let DBCursor = state.select("DB", UICursor.get("DBCursorName"));

  // Optimistic update
  let oldItem = DBCursor.get(id);
  DBCursor.unset(id);

  return ajax.delete(api.itemUrl.replace(":id", id))
    .then(response => {
      if (!response.status.startsWith("2")) {
        DBCursor.set(id, oldItem);
        alertActions.addItem({message: "Remove Item failed with message " + response.statusText, category: "error"});
      }
    });
}
