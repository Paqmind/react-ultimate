// IMPORTS =========================================================================================
import state from "frontend/state";
import reset from "frontend/actions/reset/robot";
import setFilters from "frontend/actions/set-filters/robot";
import setSorts from "frontend/actions/set-sorts/robot";
import setOffset from "frontend/actions/set-offset/robot";
import setLimit from "frontend/actions/set-limit/robot";
import loadIndex from "frontend/actions/load-index/robot";

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