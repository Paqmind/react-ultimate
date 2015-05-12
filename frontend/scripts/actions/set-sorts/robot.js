// IMPORTS =========================================================================================
import {keys, eqDeep} from "ramda";
import {recalculatePaginationWithSorts} from "frontend/helpers/pagination";
import state, {ROBOT} from "frontend/state";

// ACTIONS =========================================================================================
export default function setSorts(newSorts=ROBOT.SORTS) {
  console.debug(`setSorts(${JSON.stringify(newSorts)})`);

  let cursor = state.select("robots");
  let models = cursor.get("models");
  let total = cursor.get("total");
  let sorts = cursor.get("sorts");
  let limit = cursor.get("limit");
  let pagination = cursor.get("pagination");

  if (!eqDeep(newSorts, sorts)) {
    cursor.set("sorts", newSorts);
    if (total && keys(models).length >= total) {
      // Full index loaded – can recalculate pagination
      let newPagination = recalculatePaginationWithSorts(
        pagination, newSorts, models, limit
      );
      cursor.set("pagination", newPagination);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", []);
    }
  }

  return newSorts;
}
