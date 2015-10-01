import api from "shared/api/monster";
import {Monster} from "shared/types/monster";
import {parseAs} from "shared/parsers";
import state from "frontend/state";
import ajax from "frontend/ajax";

let data$ = state.select(api.plural);
let items$ = data$.select("items");

// Object -> Maybe Monster
export default function editItem(data) {
  console.debug(api.plural + `.editItem(${data.id})`);

  let item = parseAs(data, Monster);
  let id = item.id;

  // Optimistic update
  let oldItem = items$.get(id);
  items$.set(id, item);

  return ajax.put(api.itemUrl.replace(":id", id), item)
    .then(response => {
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = items$.set(id, Monster(response.data.data));
        }
        return item;
      } else {
        items$.set(id, oldItem);
        throw Error(response.statusText);
      }
    });
}
