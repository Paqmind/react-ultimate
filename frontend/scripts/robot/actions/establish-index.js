// IMPORTS =========================================================================================
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

  setFilters(cursor.get("filters") || undefined); // false -> undefined
  setSorts(cursor.get("sorts") || undefined);     // false -> undefined
  setOffset(cursor.get("offset"));
  setLimit(cursor.get("limit"));

  loadIndex();
}