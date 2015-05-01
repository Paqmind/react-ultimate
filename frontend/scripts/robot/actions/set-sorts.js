// IMPORTS =========================================================================================
import isEqual from "lodash.isequal";
import sortByOrder from "lodash.sortbyorder";
import {chunked, lodashifySorts, flattenArrayGroup, findFirstLesserOffset} from "shared/common/helpers";
import state, {ROBOT} from "frontend/common/state";

// ACTIONS =========================================================================================
export default function setSorts(sorts=ROBOT.SORTS) {
  console.debug(`setSorts(${JSON.stringify(sorts)})`);

  let cursor = state.select("robots");
  if (!isEqual(sorts, cursor.get("sorts"))) {
    cursor.set("sorts", sorts);
    let paginationLength = flattenArrayGroup(cursor.get("pagination")).length;
    if (paginationLength && paginationLength >= cursor.get("total")) {
      // Full index loaded – can recalculate pagination
      console.debug("Full index loaded, recalculating pagination...");
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

// HELPERS =========================================================================================
/**
 * Recalculates `pagination` with new `sorts`
 * May be applied only when `models.length == total`, so `models`
 * represent full set of ids and `pagination` can then be recreated from scrath.
 * @pure
 * @param pagination {Object<string, Array>} - input pagination
 * @param sorts {Array<string>} - new sorts
 * @param models {Object<string, Object>} - obj of models
 * @param limit {number} - current limit
 * @returns {Object<string, Array>} - recalculated pagination
 */
function recalculatePaginationWithSorts(pagination, sorts, models, limit) {
  if (!pagination instanceof Object) {
    throw new Error(`pagination must be a basic Object, got ${pagination}`);
  }
  if (!sorts instanceof Array) {
    throw new Error(`sorts must be a basic Array, got ${sorts}`);
  }
  if (!models instanceof Object) {
    throw new Error(`models must be a basic Object, got ${models}`);
  }
  if (typeof limit != "number" || limit <= 0) {
    throw new Error(`limit must be a positive number, got ${limit}`);
  }
  if (Object.keys(pagination).length) {
    if (sorts.length) {
      let unsortedModels = Object.values(models);
      let sortedModels = sortByOrder(unsortedModels, ...lodashifySorts(sorts));
      return chunked(sortedModels.map(m => m.id), limit).reduce((obj, ids, i) => {
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
