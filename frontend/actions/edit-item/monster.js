import api from "shared/api/monster";
import Monster from "shared/items/monster";
import state from "frontend/state";
import ajax from "frontend/ajax";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $items = $data.select("items");

// ACTIONS =========================================================================================
// Object -> Maybe Monster
export default function editItem(data) {
  console.debug(api.plural + `.editItem(${data.id})`);

  let item = Monster(data);
  let id = item.id;

  // Optimistic update
  let oldMonster = $items.get(id);
  $items.set(id, item);

  return ajax.put(api.itemUrl.replace(":id", id), item)
    .then(response => {
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = $items.set(id, Monster(response.data.data));
        }
        return item;
      } else {
        $items.set(id, oldMonster);
        alertActions.addItem({message: "Edit Monster failed with message " + response.statusText, category: "error"});
        return;
      }
    });
}
