import state from "frontend/state";

// CURSORS =========================================================================================
let $url = state.select("url");
let $data = state.select("alerts");
let $models = $data.select("models");

// ACTIONS =========================================================================================
// Id -> Maybe Model
export default function removeModel(id) {
  let oldModel = $models.get(id);
  $models.unset(id); // TODO returns oldModel?! `return $models.unset(id);` is enough?!
  return oldModel;
}
