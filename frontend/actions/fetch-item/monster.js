import api from "shared/api/monster";
import {Monster} from "shared/types";
import state from "frontend/state";
import ajax from "frontend/ajax";

let DBCursor = state.select("DB", api.plural);

// Id -> Maybe Monster
export default function fetchItem(id) {
  console.debug(api.plural + `.fetchItem(${id})`);

  return ajax.get(api.itemUrl.replace(":id", id))
    .then(response => {
      if (response.status.startsWith("2")) {
        let item = Monster(response.data.data);
        DBCursor.set(id, item);
        return item;
      } else {
        return undefined;
      }
    });
}
