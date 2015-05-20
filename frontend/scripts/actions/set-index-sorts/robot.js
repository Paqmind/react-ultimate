// IMPORTS =========================================================================================
import {keys, eqDeep} from "ramda";
import {recalculatePaginationWithSorts} from "frontend/helpers/pagination";
import state, {ROBOT} from "frontend/state";

// ACTIONS =========================================================================================
export default function setIndexSorts(newSorts=ROBOT.SORTS) {
  console.debug(`setIndexSorts(${JSON.stringify(newSorts)})`);

  let cursor = state.select("robots");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let total = cursor.get("total");
  let models = cursor.get("models");
  let pagination = cursor.get("pagination");

  if (!eqDeep(newSorts, sorts)) {
    cursor.set("sorts", newSorts);
    if (total && pagination.length >= total) {
      // Full index loaded – can recalculate pagination
      // TODO this should be in currentRobots facet ?!
      let newPagination = recalculatePaginationWithSorts(filters, newSorts, models, pagination);
      cursor.set("pagination", newPagination);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", []);
    }
  }

  return newSorts;
}
