// IMPORTS =========================================================================================
import {formatJsonApiQuery} from "frontend/common/helpers";
import state from "frontend/common/state";
import router from "frontend/common/router";
import loadIndex from "./load-index";

// ACTIONS =========================================================================================
export default function establishIndex() {
  console.debug("establishIndex");

  let urlCursor = state.select("url");
  let robotsCursor = state.select("robots");
  let urlFilters = urlCursor.get("filters");
  let urlSorts = urlCursor.get("sorts");
  let urlOffset = urlCursor.get("offset");
  let urlLimit = urlCursor.get("limit");

  if (urlFilters) {
    robotsCursor.set("filters", urlFilters);
  }
  if (urlSorts) {
    robotsCursor.set("sorts", urlSorts);
  }
  if (urlOffset || urlOffset === 0) {
    robotsCursor.set("offset", urlOffset);
  }
  if (urlLimit || urlLimit === 0) {
    robotsCursor.set("limit", urlLimit);
  }
  state.commit();

  loadIndex();
}