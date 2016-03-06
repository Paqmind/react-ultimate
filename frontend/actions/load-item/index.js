import api from "shared/api/robot";
import state from "frontend/state";
import fetchItem from "frontend/actions/fetch-item/index";

// Cursor, Cursor, Type, Api -> Promise
export default function loadItem(DBCursor, UICursor, Type, api) {
  console.debug(api.plural + `.loadItem()`);

  let id = UICursor.get("id");
  let item = DBCursor.get(id);

  if (item) {
    return Promise.resolve();
  } else {
    return fetchItem(DBCursor, UICursor, Type, api);
  }
}
