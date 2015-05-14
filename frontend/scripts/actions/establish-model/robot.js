// IMPORTS =========================================================================================
import state from "frontend/state";
import setModelId from "frontend/actions/set-model-id/robot";
import loadModel from "frontend/actions/load-model/robot";

// ACTIONS =========================================================================================
export default function establishModel() {
  console.debug("establishModel");

  let cursor = state.select("url");

  viewModel(cursor.get("id"));

  loadModel();
}