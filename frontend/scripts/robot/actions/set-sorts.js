// IMPORTS =========================================================================================
import isEqual from "lodash.isequal";
import {isFullIndex, recalculatePaginationWithSorts} from "frontend/helpers/pagination";
import state, {ROBOT} from "frontend/state";

// ACTIONS =========================================================================================
export default function setSorts(sorts=ROBOT.SORTS) {
  console.debug(`setSorts(${JSON.stringify(sorts)})`);

  let cursor = state.select("robots");
  if (!isEqual(sorts, cursor.get("sorts"))) {
    cursor.set("sorts", sorts);
    if (isFullIndex(cursor.get("total"), cursor.get("pagination"))) {
      // Full index loaded – can recalculate pagination
      let pagination = recalculatePaginationWithSorts(
        cursor.get("pagination"), sorts, cursor.get("models"), cursor.get("limit")
      );
      cursor.set("pagination", pagination);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", {});
    }
    state.commit();
  }
}
