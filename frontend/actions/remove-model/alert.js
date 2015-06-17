import state from "frontend/state";

// CURSORS =========================================================================================
let urlCursor = state.select("url");
let modelCursor = state.select("alerts");

// ACTIONS =========================================================================================
export default function removeModel(id) {
  modelCursor.select("models").unset(id);
}
