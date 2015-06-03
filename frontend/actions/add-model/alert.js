// IMPORTS =========================================================================================
import Alert from "shared/models/alert";
import state from "frontend/state";

// CURSORS =========================================================================================
let modelCursor = state.select("alerts");

// ACTIONS =========================================================================================
export default function addModel(model) {
  let newModel = Alert(model);
  let id = newModel.id;

  modelCursor.select("models").set(id, newModel);
}
