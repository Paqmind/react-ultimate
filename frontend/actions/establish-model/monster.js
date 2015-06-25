import state from "frontend/state";
import loadModel from "frontend/actions/load-model/monster";

// CURSORS =========================================================================================
let urlCursor = state.select("url");
let modelCursor = state.select("monsters");

// ACTIONS =========================================================================================
export default function establishModel() {
  console.debug("establishModel");

  modelCursor.set("id", urlCursor.get("id"));

  loadModel();
}
