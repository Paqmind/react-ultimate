import api from "shared/api/robot";
import state from "frontend/state";
import fetchModel from "frontend/actions/fetch-model/robot";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $models = $data.select("models");

// ACTIONS =========================================================================================
export default function loadModel() {
  console.debug(api.plural + `.loadModel()`);

  let id = $data.get("id");
  let model = $models.get(id);

  if (model) {
    return Promise.resolve(model);
  } else {
    return fetchModel(id);
  }
}
