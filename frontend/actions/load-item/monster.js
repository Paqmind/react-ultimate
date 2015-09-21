import api from "shared/api/monster";
import state from "frontend/state";
import fetchItem from "frontend/actions/fetch-item/monster";

let $data = state.select(api.plural);
let $items = $data.select("items");

export default function loadItem() {
  console.debug(api.plural + `.loadItem()`);

  let id = $data.get("id");
  let item = $items.get(id);

  if (item) {
    return Promise.resolve(item);
  } else {
    return fetchItem(id);
  }
}
