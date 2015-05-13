// IMPORTS =========================================================================================
import {append, keys, filter, map, pipe, values} from "ramda";
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
 * @pure
 * @param filters {number} - new filters
 * @param pagination {Array<string>} - input pagination
 * @param models {Object<string, Object>} - obj of models
 * @return {Array<string>} - recalculated pagination
 */
export function recalculatePaginationWithFilters(filters, pagination, models) {
  if (!(filters instanceof Object)) {
    throw new Error(`filters must be a basic Object, got ${filters}`);
  }
  if (!(pagination instanceof Array)) {
    throw new Error(`pagination must be a basic Array, got ${pagination}`);
  }
  if (!(models instanceof Object)) {
    throw new Error(`models must be a basic Object, got ${models}`);
  }
  if (pagination.length && keys(filters).length) {
    return pipe(
      map(id => id && models[id]),
      filterByAll(filters),
      map(model => model && model.id)
    )(pagination);
  } else {
    return pagination;
  }
}

/**
 * Recalculates `pagination` with new `sorts`
 * @pure
 * @param sorts {Array<string>} - new sorts
 * @param pagination {Array<string>} - input pagination
 * @param models {Object<string, Object>} - obj of models
 * @return {Array<string>} - recalculated pagination
 */
export function recalculatePaginationWithSorts(sorts, pagination, models) {
  if (!(sorts instanceof Array)) {
    throw new Error(`sorts must be a basic Array, got ${sorts}`);
  }
  if (!(pagination instanceof Array)) {
    throw new Error(`pagination must be a basic Array, got ${pagination}`);
  }
  if (!(models instanceof Object)) {
    throw new Error(`models must be a basic Object, got ${models}`);
  }
  if (pagination.length && sorts.length) {
    return pipe(
      map(id => id && models[id]),
      sortByAll(sorts),
      map(model => model && model.id)
    )(pagination);
  } else {
    return pagination;
  }
}

/**
 * Recalculates `pagination` after model removal
 * @pure
 * @param id {Array<string>} - id of removed model
 * @param pagination {Array<string>} - original pagination
 * @return {Array<string>} - new pagination
 */
export function recalculatePaginationWithoutModel(id, pagination) {
  if (!(typeof id == "string") || !id) {
    throw new Error(`id must be a non-empty string, got ${id}`);
  }
  if (!(pagination instanceof Array)) {
    throw new Error(`pagination must be a basic Array, got ${pagination}`);
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
 * @param filters {Array<string, *>} - current filters
 * @param sorts {Array<string>} - current sorts
 * @param id {Array<string>} - id of added model
 * @param pagination {Array<string>} - original pagination
 * @param models {Object<string, Object>} - obj of models
 * @return {Array<string>} - new pagination
 */
export function recalculatePaginationWithModel(filters, sorts, id, pagination, models) {
  if (!(filters instanceof Object)) {
    throw new Error(`filters must be a basic models, got ${models}`);
  }
  if (!(sorts instanceof Array)) {
    throw new Error(`sorts must be a basic models, got ${models}`);
  }
  if (!(typeof id == "string") || !id) {
    throw new Error(`id must be a non-empty string, got ${id}`);
  }
  if (!(pagination instanceof Array)) {
    throw new Error(`pagination must be a basic Array, got ${pagination}`);
  }
  if (!(models instanceof Object)) {
    throw new Error(`models must be a basic models, got ${models}`);
  }
  if (pagination.length) {
    return pipe(
      append(id),
      map(id => id && models[id]),
      filterByAll(filters),
      sortByAll(sorts),
      map(model => model && model.id)
    )(pagination);
  } else {
    return pagination;
  }
}