// IMPORTS =========================================================================================
import Axios from "axios";
import state from "frontend/state";
import fetchModel from "frontend/actions/fetch-model/robot";

// CURSORS
let modelCursor = state.select("robots");

// ACTIONS =========================================================================================
export default function loadModel() {
  console.debug("loadModel()");

  let id = modelCursor.get("id");
  let model = modelCursor.get("models", id);
  if (!model) {
    fetchModel(id);
  }
}
