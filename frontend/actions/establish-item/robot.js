import api from "shared/api/robot";
import state from "frontend/state";
import loadItem from "frontend/actions/load-item/robot";

// CURSORS =========================================================================================
let $url = state.select("url");
let $data = state.select(api.plural);

// ACTIONS =========================================================================================
export default function establishItem() {
  console.debug(api.plural + `.establishItem()`);

  $data.set("id", $url.get("params").id);

  return loadItem();
}
