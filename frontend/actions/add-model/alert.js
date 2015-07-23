import Alert from "shared/models/alert";
import state from "frontend/state";

// CURSORS =========================================================================================
let $alertQueue = state.select("alertQueue");

// ACTIONS =========================================================================================
// ModelData -> Model
export default function addAlert(model) {
  model = Alert(model);
  $alertQueue.push(model);
  return model;
}
