// IMPORTS =========================================================================================
import isEqual from "lodash.isequal";
import {groupLength, recalculatePaginationWithSorts} from "frontend/helpers/pagination";
import state, {MONSTER} from "frontend/state";

// ACTIONS =========================================================================================
export default function setSorts(newSorts=MONSTER.SORTS) {
  console.debug(`setSorts(${JSON.stringify(newSorts)})`);

  let cursor = state.select("monsters");
  let models = cursor.get("models");
  let total = cursor.get("total");
  let sorts = cursor.get("sorts");
  let limit = cursor.get("limit");
  let pagination = cursor.get("pagination");

  if (!isEqual(newSorts, sorts)) {
    cursor.set("sorts", newSorts);
    if (total && groupLength(pagination) >= total) {
      // Full index loaded – can recalculate pagination
      console.debug("Full index loaded, recalculating pagination...");
      let newPagination = recalculatePaginationWithSorts(
        pagination, newSorts, models, limit
      );
      cursor.set("pagination", newPagination);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", {});
    }
    state.commit();
  }

  return newSorts;
}
