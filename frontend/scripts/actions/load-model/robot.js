// IMPORTS =========================================================================================
import Axios from "axios";
import state from "frontend/state";
import fetchModel from "frontend/actions/fetch-model/robot";

// ACTIONS =========================================================================================
export default function loadModel() {
  console.debug("loadModel");

  let cursor = state.select("robots");
  let models = cursor.get("models");
  let id = cursor.get("id");

  let model = models[id];
  if (!model) {
    fetchModel(id);
  }
}