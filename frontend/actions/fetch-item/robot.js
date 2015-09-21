import api from "shared/api/robot";
import Robot from "shared/types/robot";
import state from "frontend/state";
import ajax from "frontend/ajax";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $items = $data.select("items");

// ACTIONS =========================================================================================
// Id -> Maybe Robot
export default function fetchItem(id) {
  console.debug(api.plural + `.fetchItem(${id})`);

  return ajax.get(api.itemUrl.replace(`:id`, id))
    .then(response => {
      if (response.status.startsWith("2")) {
        let item = Robot(response.data.data);
        $items.set(id, item);
        return item;
      } else {
        return;
      }
    });
}
