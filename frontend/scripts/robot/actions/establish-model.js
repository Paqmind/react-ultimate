// IMPORTS =========================================================================================
import {formatJsonApiQuery} from "shared/common/helpers";
import state from "frontend/common/state";
import router from "frontend/common/router";
import loadModel from "./load-model";

// ACTIONS =========================================================================================
export default function establishModel() {
  console.debug("establishModel");

  let urlCursor = state.select("url");
  let robotsCursor = state.select("robots");
  let urlId = urlCursor.get("id");

  if (urlId) {
    robotsCursor.set("id", urlId);
  }
  state.commit();

  loadModel();
}