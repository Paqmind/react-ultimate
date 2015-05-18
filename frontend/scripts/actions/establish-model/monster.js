// IMPORTS =========================================================================================
import state from "frontend/state";
import setModelId from "frontend/actions/set-model-id/monster";
import loadModel from "frontend/actions/load-model/monster";

// ACTIONS =========================================================================================
export default function establishModel() {
  console.debug("establishModel");

  let urlCursor = state.select("url");

  setModelId(urlCursor.get("id"));

  loadModel();
}