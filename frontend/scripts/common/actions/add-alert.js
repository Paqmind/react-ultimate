// IMPORTS =========================================================================================
let {Alert} = require("frontend/common/models");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function add(model) {
  let newModel = Alert(model);
  let id = newModel.id;
  let apiURL = `/api/alerts/${id}`;

  // Nonpersistent add
  State.select("alerts", "models").set(id, newModel);
}
