// IMPORTS =========================================================================================
import isEqual from "lodash.isequal";
import findWhere from "lodash.findwhere";

import {chunked, formatJsonApiQuery, flattenArrayGroup, firstLesserOffset} from "shared/common/helpers";
import state, {ROBOT} from "frontend/common/state";
import router from "frontend/common/router";

// ACTIONS =========================================================================================
export default function setFilters(filters=ROBOT.FILTERS) {
  console.debug(`setFilters(${JSON.stringify(filters)})`);

  let cursor = state.select("robots");
  if (!isEqual(filters, cursor.get("filters"))) {
    cursor.set("filters", filters);
    let paginationLength = flattenArrayGroup(cursor.get("pagination")).length;
    if (paginationLength && paginationLength >= cursor.get("total")) {
      // Full index loaded – can recalculate pagination
      console.log("Full index loaded, recalculating pagination...");
      let pagination = recalculatePaginationWithFilters(
        cursor.get("pagination"), filters, cursor.get("models"), cursor.get("limit")
      );
      if (!pagination[cursor.get("offset")]) {
        // Number of pages reduced - redirect to closest
        let offset = firstLesserOffset(pagination, cursor.get("offset"));
        let query = formatJsonApiQuery({offset});
        router.transitionTo(undefined, undefined, query);
      }
      cursor.set("pagination", pagination);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", {});
    }
    state.commit();
  }
}

// HELPERS =========================================================================================
/**
 * Recalculates `pagination` with new `filters`
 * May be applied only when `models.length == total`, so `models`
 * represent full set of ids and `pagination` can then be recreated from scrath.
 * @pure
 * @param pagination {Object<string, Array>} - input pagination
 * @param filters {number} - new filters
 * @param models {Object<string, Object>} - obj of models
 * @param limit {number} - current limit
 * @returns {Object<string, Array>} - recalculated pagination
 */
function recalculatePaginationWithFilters(pagination, filters, models, limit) {
  if (!pagination instanceof Object) {
    throw new Error(`pagination must be a basic Object, got ${pagination}`);
  }
  if (!filters instanceof Object) {
    throw new Error(`filters must be a basic Object, got ${filters}`);
  }
  if (!models instanceof Object) {
    throw new Error(`models must be a basic Object, got ${models}`);
  }
  if (typeof limit != "number" || limit <= 0) {
    throw new Error(`limit must be a positive number, got ${limit}`);
  }
  if (Object.keys(pagination).length) {
    if (Object.keys(filters).length) {
      let unfilteredModels = Object.values(models);
      let filteredModels = findWhere(unfilteredModels, filters);
      return chunked(filteredModels.map(m => m.id), limit).reduce((obj, ids, i) => {
        obj[i * limit] = ids;
        return obj;
      }, {});
    } else {
      return pagination;
    }
  } else {
    return {};
  }
}
