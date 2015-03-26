// IMPORTS =========================================================================================
let State = require("frontend/state");
let Alert = require("frontend/alert/models");

// ACTIONS =========================================================================================
export default function add(model) {
  let newModel = Alert(model);
  let id = newModel.id;
  let apiURL = `/api/alerts/${id}`;

  // Nonpersistent add
  State.select("alerts", "models").set(id, newModel);
}
