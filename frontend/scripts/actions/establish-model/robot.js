// IMPORTS =========================================================================================
import state from "frontend/state";
import setModelId from "frontend/actions/set-model-id/robot";
import loadModel from "frontend/actions/load-model/robot";

// ACTIONS =========================================================================================
export default function establishModel() {
  console.debug("establishModel");

  let urlCursor = state.select("url");

  setModelId(urlCursor.get("id"));

  loadModel();
}