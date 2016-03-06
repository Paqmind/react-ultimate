import {assoc, curry, forEach, reduce} from "ramda";
import UUID from "node-uuid";
import state from "frontend/state";
import ajax from "frontend/ajax";
import {parseAs} from "shared/parsers";


// Cursor, Type, Api -> Maybe Item
function addItem(UICursor, Type, api) {
  let data = UICursor.get("addForm");
  console.debug(api.singular + `.addItem(...)`);

  let DBCursor = state.select("DB", UICursor.get("DBCursorName"));

  data = assoc("id", data.id || UUID.v4(), data);
  let item = parseAs(Type, data);
  let id = item.id;

  // Optimistic update
  let UIListCursors = state.select("UI").get();
  let oldListIds = reduce((memo, key) => {
    if (UIListCursors[key].DBCursorName == UICursor.get("DBCursorName") && UIListCursors[key].ids) {
      memo[key] = UIListCursors[key].ids;
    }
    return memo;
  }, {}, Object.keys(UIListCursors));

  // Set id in item cursor
  UICursor.set("id", id);

  // Reset ids from pagination, coz they should be recalculated after adding new item
  forEach(key => {
    let cursor = state.select("UI", key);
    cursor.set("ids", []);
  }, Object.keys(oldListIds));

  // Add item from DB
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
        UICursor.set("id", null);
        forEach(key => {
          let cursor = state.select("UI", key);
          cursor.set("ids", oldListIds[key]);
        }, Object.keys(oldListIds));
        DBCursor.unset(id);
        throw Error(response.statusText);
      }
    });
}

export default curry(addItem);
