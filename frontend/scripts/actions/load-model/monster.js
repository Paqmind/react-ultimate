// IMPORTS =========================================================================================
import Axios from "axios";
import state from "frontend/scripts/state";
import fetchModel from "frontend/scripts/actions/fetch-model/monster";

// CURSORS
let modelCursor = state.select("monsters");

// ACTIONS =========================================================================================
export default function loadModel() {
  console.debug("loadModel()");

  let id = modelCursor.get("id");
  let model = modelCursor.get("models", id);
  if (!model) {
    fetchModel(id);
  }
}
