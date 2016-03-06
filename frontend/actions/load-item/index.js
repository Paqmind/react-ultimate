import {curry} from "ramda";
import ajax from "frontend/ajax";
import state from "frontend/state";
import api from "shared/api/robot";
import {parseAs} from "shared/parsers";


//  Cursor, Type, Api -> Promise
function loadItem(UICursor, Type, api, id) {
  console.debug(api.singular + `.loadItem()`);

  let DBCursor = state.select("DB", UICursor.get("DBCursorName"));
  UICursor.set("id", id);
  let item = DBCursor.get(id);

  // if item is already loaded
  if (item) return Promise.resolve();

  return ajax.get(api.itemUrl.replace(`:id`, id))
    .then(response => {
      if (response.status.startsWith("2")) {
        let item = parseAs(Type, response.data.data);
        DBCursor.set(id, item);
      }
    });
}

export default curry(loadItem);
