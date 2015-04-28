// IMPORTS =========================================================================================
import state from "frontend/common/state";
import {Alert} from "frontend/common/models";

// ACTIONS =========================================================================================
export default function add(model) {
  let newModel = Alert(model);
  let id = newModel.id;
  let apiURL = `/api/alerts/${id}`;

  // Nonpersistent add
  state.select("alerts", "models", id).set(newModel);
}
