// IMPORTS =========================================================================================
import filter from "lodash.filter";
import sortBy from "lodash.sortby";
import {chunked, flattenArrayGroup, sortByAll} from "shared/helpers/common";

// PAGINATION ======================================================================================
export function groupLength(group) {
  return group ? flattenArrayGroup(group).length : 0;
}

export function isCacheAvailable(total, pagination, offset, limit) {
  let ids = pagination[offset];
  if (ids && ids.length) {
    if (offset == getLastOffset(total, limit)) {
      let totalPages = getTotalPages(total, limit);
      return ids.length >= limit - ((totalPages * limit) - total);
    } else {
      return ids.length >= limit;
    }
  } else {
    return false;
  }
}

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

//export function areAllOffsetsLoaded(total, pagination) {
//  let paginationTotal = groupLength(pagination);
//  if (paginationTotal) {
//    return paginationTotal >= total;
//  } else {
//    return false;
//  }
//}

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
export function recalculatePaginationWithFilters(pagination, filters, models, limit) {
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
      let filteredModels = filter(unfilteredModels, filters);
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
export function recalculatePaginationWithSorts(pagination, sorts, models, limit) {
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
      let sortedModels = sortByAll(sorts, unsortedModels);
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

/**
 * Recalculates `pagination` with new limit (perpage)
 * May be applied when `models.length != total`, so
 * `pagination` can't be recreated from scrath.
 * * Supports invalid data like overlapping offsets
 * @pure
 * @param pagination {Object} - input pagination
 * @param limit {Number} - new limit (perpage)
 * @returns {Object} - recalculated pagination
 */
export function recalculatePaginationWithLimit(pagination, limit) {
  if (!pagination instanceof Object) {
    throw new Error(`pagination must be a basic Object, got ${pagination}`);
  }
  if (typeof limit != "number" || limit <= 0) {
    throw new Error(`limit must be a positive number, got ${limit}`);
  }
  if (Object.keys(pagination).length) {
    let maxOffset = Math.max.apply(Math, Object.keys(pagination));
    let length = maxOffset + pagination[maxOffset].length;
    let offsets = sortBy(Object.keys(pagination).map(v => parseInt(v)));
    let ids = offsets
      .reduce((memo, offset) => {
        pagination[offset].forEach((id, i) => {
          memo[offset + i] = id;
        });
        return memo;
      }, Array(length));
    // => [,,,,,1,2,3,4,5,,,,,]
    return chunked(ids, limit).reduce((obj, offsetIds, i) => {
      offsetIds = filter(offsetIds);
      if (ids.length) {
        obj[i * limit] = offsetIds;
      }
      return obj;
    }, {}); // => {5: [1, 2, 3, 4, 5]}
  } else {
    return {};
  }
}