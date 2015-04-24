// IMPORTS =========================================================================================
let {Alert} = require("frontend/common/models");
let state = require("frontend/state");

// ACTIONS =========================================================================================
export default function add(model) {
  let newModel = Alert(model);
  let id = newModel.id;
  let apiURL = `/api/alerts/${id}`;

  // Nonpersistent add
  state.select("alerts", "models", id).set(newModel);
}
