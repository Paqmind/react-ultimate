// IMPORTS =========================================================================================
import state from "frontend/scripts/state";
import loadModel from "frontend/scripts/actions/load-model/robot";

// ACTIONS =========================================================================================
export default function establishModel() {
  console.debug("establishModel");

  let urlCursor = state.select("url");
  let modelCursor = state.select("robots");
  if (urlCursor.get("id") != modelCursor.get("id")) {
    modelCursor.set("id", urlCursor.get("id"));
  }

  loadModel();
}
