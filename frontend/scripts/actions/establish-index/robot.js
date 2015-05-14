// IMPORTS =========================================================================================
import state from "frontend/state";
import resetIndex from "frontend/actions/reset-index/robot";
import setFilters from "frontend/actions/set-index-filters/robot";
import setSorts from "frontend/actions/set-index-sorts/robot";
import setOffset from "frontend/actions/set-index-offset/robot";
import setLimit from "frontend/actions/set-index-limit/robot";
import loadIndex from "frontend/actions/load-index/robot";

// ACTIONS =========================================================================================
export default function establishIndex() {
  console.debug("establishIndex");

  let urlCursor = state.select("url");

  if (urlCursor.get("reset")) {
    resetIndex();
  }
  setFilters(urlCursor.get("filters"));
  setSorts(urlCursor.get("sorts"));
  setOffset(urlCursor.get("offset"));
  setLimit(urlCursor.get("limit"));

  loadIndex();
}