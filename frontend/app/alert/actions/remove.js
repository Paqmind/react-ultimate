// IMPORTS =========================================================================================
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function remove(id) {
  // Non-persistent remove
  State.select("alerts", "models").unset(id);
}