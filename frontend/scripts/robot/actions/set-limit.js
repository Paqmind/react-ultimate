// IMPORTS =========================================================================================
import filter from "lodash.filter";
import sortBy from "lodash.sortby";
import {recalculatePaginationWithLimit} from "frontend/helpers/pagination";
import state, {ROBOT} from "frontend/state";
import router from "frontend/router";

// ACTIONS =========================================================================================
export default function setLimit(limit=ROBOT.LIMIT) {
  console.debug(`setLimit(${limit})`);

  let cursor = state.select("robots");
  if (limit != cursor.get("limit")) {
    cursor.set("limit", limit);
    let pagination = recalculatePaginationWithLimit(
      cursor.get("pagination"), limit
    );
    cursor.set("pagination", pagination);
    state.commit();
  }
}