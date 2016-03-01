import {parseAs} from "shared/parsers";
import state from "frontend/state";
import ajax from "frontend/ajax";


// Cursor, Cursor, Type, api -> Promise
export default function fetchItem(DBCursor, UICursor, Type, api) {
  let id = UICursor.get("id");
  console.debug(api.plural + `.fetchItem(${id})`);

  return ajax.get(api.itemUrl.replace(`:id`, id))
    .then(response => {
      if (response.status.startsWith("2")) {
        let item = parseAs(Type, response.data.data);
        DBCursor.set(id, item);
      }
    });
}
