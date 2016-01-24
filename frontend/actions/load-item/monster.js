import api from "shared/api/monster";
import state from "frontend/state";
import fetchItem from "frontend/actions/fetch-item/monster";

let DBCursor = state.select("DB", api.plural);
let UICursor = state.select("UI", api.plural);

export default function loadItem() {
  console.debug(api.plural + `.loadItem()`);

  let id = UICursor.get("id");
  let item = DBCursor.get(id);

  if (item) {
    return Promise.resolve(item);
  } else {
    return fetchItem(id);
  }
}
