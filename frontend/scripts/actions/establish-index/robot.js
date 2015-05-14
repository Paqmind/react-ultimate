// IMPORTS =========================================================================================
import state from "frontend/state";
import loadIndex from "frontend/actions/load-index/robot";
import resetIndex from "frontend/actions/reset-index/robot";
import setIndexFilters from "frontend/actions/set-index-filters/robot";
import setIndexSorts from "frontend/actions/set-index-sorts/robot";
import setIndexOffset from "frontend/actions/set-index-offset/robot";
import setIndexLimit from "frontend/actions/set-index-limit/robot";

// ACTIONS =========================================================================================
export default function establishIndex() {
  console.debug("establishIndex");

  let urlCursor = state.select("url");

  if (urlCursor.get("reset")) {
    resetIndex();
  }
  setIndexFilters(urlCursor.get("filters"));
  setIndexSorts(urlCursor.get("sorts"));
  setIndexOffset(urlCursor.get("offset"));
  setIndexLimit(urlCursor.get("limit"));

  loadIndex();
}