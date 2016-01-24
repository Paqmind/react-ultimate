import api from "shared/api/robot";
import {Robot} from "shared/types";
import {parseAs} from "shared/parsers";
import state from "frontend/state";
import ajax from "frontend/ajax";

let DBCursor = state.select("DB", api.plural);
let UICursor = state.select("UI", api.plural);

// Object -> Maybe Robot
export default function editItem(data) {
  console.debug(api.plural + `.editItem(${data.id})`);

  let item = parseAs(Robot, data);
  let id = item.id;

  // Optimistic update
  let oldItem = DBCursor.get(id);
  DBCursor.set(id, item);

  return ajax.put(api.itemUrl.replace(":id", id), item)
    .then(response => {
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = DBCursor.set(id, parseAs(Robot, response.data.data));
        }
        return item;
      } else {
        DBCursor.set(id, oldItem);
        throw Error(response.statusText);
      }
    });
}
