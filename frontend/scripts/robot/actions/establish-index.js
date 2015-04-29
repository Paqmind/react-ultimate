// IMPORTS =========================================================================================
import {formatJsonApiQuery} from "frontend/common/helpers";
import state from "frontend/common/state";
import router from "frontend/common/router";
import loadIndex from "./load-index";
import setFilters from "./set-filters";
import setSorts from "./set-sorts";
import setOffset from "./set-offset";
import setLimit from "./set-limit";

// ACTIONS =========================================================================================
export default function establishIndex() {
  console.debug("establishIndex");

  let cursor = state.select("url");

  //setFilters(cursor.get("filters"));
  setSorts(cursor.get("sorts"));
  setOffset(cursor.get("offset"));
  setLimit(cursor.get("limit"));

  loadIndex();
}