// IMPORTS =========================================================================================
import {keys, eqDeep} from "ramda";
import {recalculatePaginationWithFilters} from "frontend/helpers/pagination";
import state, {MONSTER} from "frontend/state";

// ACTIONS =========================================================================================
export default function setFilters(newFilters=MONSTER.FILTERS) {
  console.debug(`setFilters(${JSON.stringify(newFilters)})`);

  let cursor = state.select("monsters");
  let models = cursor.get("models");
  let total = cursor.get("total");
  let filters = cursor.get("filters");
  let limit = cursor.get("limit");
  let pagination = cursor.get("pagination");

  if (!eqDeep(newFilters, filters)) {
    cursor.set("filters", newFilters);
    if (total && keys(models).length >= total) {
      // Full index loaded – can recalculate pagination
      let newPagination = recalculatePaginationWithFilters(pagination, newFilters, models);
      cursor.set("pagination", newPagination);
      cursor.set("total", newPagination.length);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", []);
      cursor.set("total", 0);
    }
  }
}
