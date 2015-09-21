import api from "shared/api/monster";
import {Monster} from "shared/types/monster";
import state from "frontend/state";
import ajax from "frontend/ajax";

let $data = state.select(api.plural);
let $items = $data.select("items");

// Id -> Maybe Monster
export default function fetchItem(id) {
  console.debug(api.plural + `.fetchItem(${id})`);

  return ajax.get(api.itemUrl.replace(":id", id))
    .then(response => {
      if (response.status.startsWith("2")) {
        let item = Monster(response.data.data);
        $items.set(id, item);
        return item;
      } else {
        return undefined;
      }
    });
}
