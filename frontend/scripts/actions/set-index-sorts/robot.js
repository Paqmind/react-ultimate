// IMPORTS =========================================================================================
import {keys, eqDeep} from "ramda";
import {recalculatePaginationWithSorts} from "frontend/helpers/pagination";
import state, {ROBOT} from "frontend/state";

// ACTIONS =========================================================================================
export default function setIndexSorts(newSorts=ROBOT.SORTS) {
  console.debug(`setIndexSorts(${JSON.stringify(newSorts)})`);

  let cursor = state.select("robots");
  let total = cursor.get("total");
  let models = cursor.get("models");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let pagination = cursor.get("pagination");

  if (!eqDeep(newSorts, sorts)) {
    cursor.set("sorts", newSorts);
    if (total && pagination.length >= total) {
      // Full index loaded – can recalculate pagination
      let newPagination = recalculatePaginationWithSorts(models, filters, newSorts, pagination);
      cursor.set("pagination", newPagination);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", []);
    }
  }

  return newSorts;
}
