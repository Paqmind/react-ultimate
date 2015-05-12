// IMPORTS =========================================================================================
import {keys, map, pipe, values} from "ramda";
import {chunked, filterByAll, sortByAll} from "shared/helpers/common";

// EXPORTS =========================================================================================
export function getLastOffset(total, limit) {
  let totalPages = getTotalPages(total, limit);
  if (totalPages <= 1) {
    return 0;
  } else {
    return (totalPages - 1)  * limit;
  }
}

export function getTotalPages(total, limit) {
  if (typeof total != "number" || total < 0) {
    throw Error(`total must be >= 0, got ${total}`);
  }
  if (typeof limit != "number" || limit < 1) {
    throw Error(`limit must be >= 1, got ${limit}`);
  }
  return Math.ceil(total / limit);
}

/**
 * Recalculates `pagination` with new `filters`
 * May be applied only when `keys(models).length == total`, so `models`
 * represent full set of ids and `pagination` can then be recreated from scrath.
 * @pure
 * @param pagination {Array<string>} - input pagination
 * @param filters {number} - new filters
 * @param models {Object<string, Object>} - obj of models
 * @returns {Array<string>} - recalculated pagination
 */
export function recalculatePaginationWithFilters(pagination, filters, models) {
  if (!(pagination instanceof Array)) {
    throw new Error(`pagination must be a basic Array, got ${pagination}`);
  }
  if (!(filters instanceof Object)) {
    throw new Error(`filters must be a basic Object, got ${filters}`);
  }
  if (!(models instanceof Object)) {
    throw new Error(`models must be a basic Object, got ${models}`);
  }
  if (pagination.length) {
    if (keys(filters).length) {
      return map(m => m.id, filterByAll(filters, values(models)));
    } else {
      return pagination;
    }
  } else {
    return [];
  }
}

/**
 * Recalculates `pagination` with new `sorts`
 * May be applied only when `keys(models).length == total`, so `models`
 * represent full set of ids and `pagination` can then be recreated from scrath.
 * @pure
 * @param pagination {Array<string>} - input pagination
 * @param sorts {Array<string>} - new sorts
 * @param models {Object<string, Object>} - obj of models
 * @returns {Array<string>} - recalculated pagination
 */
export function recalculatePaginationWithSorts(pagination, sorts, models) {
  if (!(pagination instanceof Array)) {
    throw new Error(`pagination must be a basic Array, got ${pagination}`);
  }
  if (!(sorts instanceof Array)) {
    throw new Error(`sorts must be a basic Array, got ${sorts}`);
  }
  if (!(models instanceof Object)) {
    throw new Error(`models must be a basic Object, got ${models}`);
  }
  if (pagination.length) {
    if (sorts.length) {
      return map(m => m.id, sortByAll(sorts, values(models)));
    } else {
      return pagination;
    }
  } else {
    return [];
  }
}