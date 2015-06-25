import state from "frontend/state";
import loadModel from "frontend/actions/load-model/robot";

// CURSORS =========================================================================================
let urlCursor = state.select("url");
let modelCursor = state.select("robots");

// ACTIONS =========================================================================================
export default function establishModel() {
  console.debug("establishModel");

  modelCursor.set("id", urlCursor.get("id"));

  loadModel();
}
