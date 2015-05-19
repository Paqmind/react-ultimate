// IMPORTS =========================================================================================
import {keys, eqDeep} from "ramda";
import {recalculatePaginationWithFilters} from "frontend/helpers/pagination";
import state, {MONSTER} from "frontend/state";

// ACTIONS =========================================================================================
export default function setIndexFilters(newFilters=MONSTER.FILTERS) {
  console.debug(`setIndexFilters(${JSON.stringify(newFilters)})`);

  let cursor = state.select("monsters");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let total = cursor.get("total");
  let models = cursor.get("models");
  let pagination = cursor.get("pagination");

  if (!eqDeep(newFilters, filters)) {
    cursor.set("filters", newFilters);
    if (false && total && pagination.length >= total) { // TODO check that `filters` are subset of `newFilters`, otherwise `total` is meaningless
      // Full index loaded – can recalculate pagination
      let newPagination = recalculatePaginationWithFilters(newFilters, sorts, models, pagination);
      cursor.set("pagination", newPagination);
      cursor.set("total", newPagination.length);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", []);
      cursor.set("total", 0);
    }
  }
}
