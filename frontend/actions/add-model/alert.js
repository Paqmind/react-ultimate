import api from "shared/api/alert";
import Alert from "shared/models/alert";
import state from "frontend/state";

// CURSORS =========================================================================================
let $url = state.select("url");
let $data = state.select(api.plural);

// ACTIONS =========================================================================================
// ModelData -> Model
export default function addAlert(model) {
  model = Alert(model);
  let id = model.id;

  $data.select("models").set(id, model);
  return model;
}
