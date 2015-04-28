// IMPORTS =========================================================================================
import Axios from "axios";

import state from "frontend/common/state";
import fetchModel from "./fetch-model";

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