// IMPORTS =========================================================================================
import isEqual from "lodash.isequal";
import {groupLength, recalculatePaginationWithFilters} from "frontend/helpers/pagination";
import state, {ROBOT} from "frontend/state";

// ACTIONS =========================================================================================
export default function setFilters(newFilters=ROBOT.FILTERS) {
  console.debug(`setFilters(${JSON.stringify(newFilters)})`);

  let cursor = state.select("robots");
  let models = cursor.get("models");
  let total = cursor.get("total");
  let filters = cursor.get("filters");
  let limit = cursor.get("limit");
  let pagination = cursor.get("pagination");

  if (!isEqual(newFilters, filters)) {
    cursor.set("filters", newFilters);
    if (total && groupLength(pagination) >= total) {
      // Full index loaded – can recalculate pagination
      console.debug("Full index loaded, recalculating pagination...");
      let newPagination = recalculatePaginationWithFilters(
        pagination, newFilters, models, limit
      );
      let newTotal = groupLength(newPagination);
      cursor.set("pagination", newPagination);
      cursor.set("total", newTotal);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", {});
      cursor.set("total", 0);
    }
    state.commit();
  }
}
