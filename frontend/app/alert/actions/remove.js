// IMPORTS =========================================================================================
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function remove(id) {
  let apiURL = `/api/alerts/${id}`;

  // Non-persistent remove
  State.select("alerts", "models").unset(id);
}