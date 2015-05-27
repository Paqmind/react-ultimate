// IMPORTS =========================================================================================
import Axios from "axios";
import state from "frontend/scripts/state";

// CURSORS =========================================================================================
let modelCursor = state.select("alerts");

// ACTIONS =========================================================================================
export default function fetchModel(id) {
  modelCursor.set("loading", true);

  // TODO
}
