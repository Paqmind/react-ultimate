// IMPORTS =========================================================================================
import state from "frontend/state";
import reset from "./reset";
import setFilters from "./set-filters";
import setSorts from "./set-sorts";
import setOffset from "./set-offset";
import setLimit from "./set-limit";
import loadIndex from "./load-index";

// ACTIONS =========================================================================================
export default function establishIndex() {
  console.debug("establishIndex");

  let cursor = state.select("url");

  if (cursor.get("reset")) {
    reset();
  }
  setFilters(cursor.get("filters"));
  setSorts(cursor.get("sorts"));
  setOffset(cursor.get("offset"));
  setLimit(cursor.get("limit"));

  loadIndex();
}