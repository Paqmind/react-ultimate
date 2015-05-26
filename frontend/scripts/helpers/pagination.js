// IMPORTS =========================================================================================
import {append, keys, filter, find, map, pipe, slice, range, reject, reverse, values} from "ramda";
import {chunked, filterByAll, sortByAll} from "shared/helpers/common";

// EXPORTS =========================================================================================
export function inCache(offset, limit, total, pagination) {
  let cache = filter(v => v, slice(offset, offset + limit, pagination));
  if (cache.length) {
    if (offset == recommendOffset(total, total, limit)) {
      // last page
      let totalPages = getTotalPages(total, limit);
      return cache.length >= limit - ((totalPages * limit) - total);
    } else {
      // not last page
      return cache.length >= limit;
    }
  } else {
    return false;
  }
}

export function recommendOffset(total, offset, limit) {
  if (typeof total != "number" || total < 0) {
    throw Error(`total must be natural number, got ${total}`);
  }
  if (typeof offset != "number" || offset < 0) {
    throw Error(`offset must be natural number, got ${offset}`);
  }
  if (typeof limit != "number" || limit <= 0) {
    throw Error(`limit must be positive number, got ${limit}`);
  }

  if (total == 0) {
    return offset;
  } else {
    let totalPages = getTotalPages(total, limit);
    let lastOffset;
    if (totalPages <= 1) {
      lastOffset = 0;
    } else {
      lastOffset = (totalPages - 1)  * limit;
    }

    let possibleOffsets = reject(
      _offset => _offset % limit,   // reject everything but 0, 5, 10, 15... for limit = 5
      range(0, lastOffset + limit)  // from this range
    );

    return find(_offset => _offset <= offset, reverse(possibleOffsets)); // can't be undefined with all the code above
  }
}

export function getTotalPages(total, limit) {
  if (typeof total != "number" || total < 0) {
    throw Error(`total must be natural number, got ${total}`);
  }
  if (typeof limit != "number" || limit <= 0) {
    throw Error(`limit must be positive number, got ${limit}`);
  }
  return Math.ceil(total / limit);
}

/**
 * Recalculates `pagination` after model removal
 * @pure
 * @param models {Object<string, Object>} - current models
 * @param filters {number} - current filters
 * @param sorts {Array<string>} - current sorts
 * @param pagination {Array<string>} - current pagination
 * @param id {Array<string>} - id of removed model
 * @return {Array<string>} - new pagination
 */
export function recalculatePaginationWithoutModel(filters, sorts, models, pagination, id) {
  if (!(filters instanceof Object)) {
    throw new Error(`filters must be a basic Object, got ${filters}`);
  }
  if (!(sorts instanceof Array)) {
    throw new Error(`sorts must be a basic Array, got ${sorts}`);
  }
  if (!(models instanceof Object)) {
    throw new Error(`models must be a basic Object, got ${models}`);
  }
  if (!(pagination instanceof Array)) {
    throw new Error(`pagination must be a basic Array, got ${pagination}`);
  }
  if (!(typeof id == "string") || !id) {
    throw new Error(`id must be a non-empty string, got ${id}`);
  }
  if (pagination.length) {
    return filter(_id => _id != id, pagination);
  } else {
    return pagination;
  }
}

/**
 * Recalculates `pagination` after movel addition
 * @pure
 * @param models {Object<string, Object>} - current models
 * @param filters {Array<string, *>} - current filters
 * @param sorts {Array<string>} - current sorts
 * @param pagination {Array<string>} - current pagination
 * @param id {Array<string>} - id of new model
 * @return {Array<string>} - new pagination
 */
export function recalculatePaginationWithModel(filters, sorts, models, pagination, id) {
  if (!(filters instanceof Object)) {
    throw new Error(`filters must be a basic models, got ${models}`);
  }
  if (!(sorts instanceof Array)) {
    throw new Error(`sorts must be a basic models, got ${models}`);
  }
  if (!(models instanceof Object)) {
    throw new Error(`models must be a basic models, got ${models}`);
  }
  if (!(pagination instanceof Array)) {
    throw new Error(`pagination must be a basic Array, got ${pagination}`);
  }
  if (!(typeof id == "string") || !id) {
    throw new Error(`id must be a non-empty string, got ${id}`);
  }
  if (pagination.length) {
    return pipe(
      append(id),
      map(_id => _id && models[_id]),
      filterByAll(filters),
      sortByAll(sorts),
      map(model => model && model.id)
    )(pagination);
  } else {
    return pagination;
  }
}
