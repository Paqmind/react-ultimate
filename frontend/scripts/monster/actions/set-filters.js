// IMPORTS =========================================================================================
import isEqual from "lodash.isequal";
import {isFullIndex, recalculatePaginationWithFilters} from "frontend/helpers/pagination";
import state, {ZOMBIE} from "frontend/state";

// ACTIONS =========================================================================================
export default function setFilters(filters=ZOMBIE.FILTERS) {
  console.debug(`setFilters(${JSON.stringify(filters)})`);

  let cursor = state.select("monsters");
  if (!isEqual(filters, cursor.get("filters"))) {
    cursor.set("filters", filters);
    if (isFullIndex(cursor.get("total"), cursor.get("pagination"))) {
      // Full index loaded – can recalculate pagination
      console.debug("Full index loaded, recalculating pagination...");
      let pagination = recalculatePaginationWithFilters(
        cursor.get("pagination"), filters, cursor.get("models"), cursor.get("limit")
      );
      cursor.set("pagination", pagination);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", {});
    }
    state.commit();
  }
}
