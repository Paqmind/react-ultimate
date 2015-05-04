// IMPORTS =========================================================================================
import state from "frontend/state";
import setId from "./set-id";
import loadModel from "./load-model";

// ACTIONS =========================================================================================
export default function establishModel() {
  console.debug("establishModel");

  let cursor = state.select("url");

  setId(cursor.get("id"));

  loadModel();
}