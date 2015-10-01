import api from "shared/api/monster";
import state from "frontend/state";
import loadItem from "frontend/actions/load-item/monster";

let url$ = state.select("url");
let data$ = state.select(api.plural);

export default function establishItem() {
  console.debug(api.plural + `establishItem()`);

  data$.set("id", url$.get("params").id);

  return loadItem();
}
