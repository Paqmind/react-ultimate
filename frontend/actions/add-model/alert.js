import api from "shared/api/alert";
import Alert from "shared/models/alert";
import state from "frontend/state";

// CURSORS =========================================================================================
let $url = state.select("url");
let $data = state.select(api.plural);

// ACTIONS =========================================================================================
// Model -> Maybe Model
export default function addModel(model) {
  model = Alert(model);
  let id = model.id;

  $data.select("models").set(id, model);
  return model;
}
