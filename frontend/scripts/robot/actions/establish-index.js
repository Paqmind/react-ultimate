// IMPORTS =========================================================================================
import state from "frontend/common/state";
import loadIndex from "./load-index";
import setFilters from "./set-filters";
import setSorts from "./set-sorts";
import setOffset from "./set-offset";
import setLimit from "./set-limit";

// ACTIONS =========================================================================================
export default function establishIndex() {
  console.debug("establishIndex");

  let urlCursor = state.select("url");
  let robotCursor = state.select("robots");

  if (urlCursor.get("reset")) {
    robotCursor.set("pagination", {});
    state.commit();
  }
  setFilters(urlCursor.get("filters"));
  setSorts(urlCursor.get("sorts"));
  setOffset(urlCursor.get("offset"));
  setLimit(urlCursor.get("limit"));

  loadIndex();
}