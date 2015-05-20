// IMPORTS =========================================================================================
import {Alert} from "shared/models/alert";
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function add(model) {
  let newModel = Alert(model);
  let id = newModel.id;
  let url = `/api/alerts/${id}`;

  // Nonpersistent add
  state.select("alerts", "models", id).set(newModel);
}
