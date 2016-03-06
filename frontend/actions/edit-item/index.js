import {curry, forEach, reduce} from "ramda";
import state from "frontend/state";
import ajax from "frontend/ajax";
import {parseAs} from "shared/parsers";


// Cursor, Type, Api -> Maybe Item
function editItem(UICursor, Type, api) {
  let data = UICursor.get("editForm");
  console.debug(api.singular + `.editItem(${data.id})`);

  let DBCursor = state.select("DB", UICursor.get("DBCursorName"));

  let item = parseAs(Type, data);
  let id = item.id;

  // Optimistic update
  let oldItem = DBCursor.get(id);
  let UIListCursors = state.select("UI").get();
  let oldListIds = reduce((memo, key) => {
    if (UIListCursors[key].DBCursorName == UICursor.get("DBCursorName") && UIListCursors[key].ids) {
      memo[key] = UIListCursors[key].ids;
    }
    return memo;
  }, {}, Object.keys(UIListCursors));

  // Reset ids from pagination, coz they should be recalculated after editin any item
  forEach(key => {
    let cursor = state.select("UI", key);
    cursor.set("ids", []);
  }, Object.keys(oldListIds));

  // Update item in the DB
  DBCursor.set(id, item);

  return ajax.put(api.itemUrl.replace(":id", id), item)
    .then(response => {
      if (response.status.startsWith("2")) {
        if (response.data.data) {
          item = DBCursor.set(id, parseAs(Type, response.data.data));
          DBCursor.set(id, item);
          return item;
        } else {
          throw Error(response.statusText);
        }
      } else {
         // Rollback
        forEach(key => {
          let cursor = state.select("UI", key);
          cursor.set("ids", oldListIds[key]);
        }, Object.keys(oldListIds));
        DBCursor.set(id, oldItem);
        throw Error(response.statusText);
      }
    });
}

export default curry(editItem);
