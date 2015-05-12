// IMPORTS =========================================================================================
import state from "frontend/state";
import setId from "frontend/actions/set-id/robot";
import loadModel from "frontend/actions/load-model/robot";

// ACTIONS =========================================================================================
export default function establishModel() {
  console.debug("establishModel");

  let cursor = state.select("url");

  setId(cursor.get("id"));

  loadModel();
}