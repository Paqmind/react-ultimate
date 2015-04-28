// IMPORTS =========================================================================================
import filter from "lodash.filter";
import flatten from "lodash.flatten";
import sortBy from "lodash.sortby";

import {chunked} from "shared/common/helpers";
import {formatJsonApiQuery} from "frontend/common/helpers";
import state from "frontend/common/state";
import router from "frontend/common/router";
import loadIndex from "./load-index";

// ACTIONS =========================================================================================
export default function setLimit(limit) {
  console.debug("setLimit:", limit);

  let urlCursor = state.select("url");
  let currentUrlParams = urlCursor.get("params");
  let currentUrlQuery = urlCursor.get("query");

  let robotCursor = state.select("robots");
  let currentOffset = robotCursor.get("offset");
  let currentLimit = robotCursor.get("limit");
  let currentPagination = robotCursor.get("pagination");

  if (limit != currentLimit) {
    let newLimit = limit;
    let newPagination = recalculatePaginationWithLimit(currentPagination, newLimit);

    robotCursor.set("limit", newLimit);
    robotCursor.set("pagination", newPagination);
    if (!newPagination[currentOffset]) {
      let newOffset = firstLesserOffset(newPagination, currentOffset);
      let newUrlQuery = formatJsonApiQuery({offset: newOffset});
      router.transitionTo(undefined, undefined, newUrlQuery);
    }
    state.commit();

    loadIndex();
  }
}

// HELPERS =========================================================================================
/**
 * Recalculates `pagination` with new limit (perpage)
 * Supports invalid data like overlapping offsets
 * @pure
 * @param pagination {Object} - input pagination
 * @param newLimit {Number} - new limit (perpage)
 * @returns {Object} - recalculated pagination
 */
function recalculatePaginationWithLimit(pagination, newLimit) {
  if (newLimit <=0 ) {
    throw new Error(`newLimit must be >= 0, got ${newLimit}`);
  }
  let maxOffset = Math.max.apply(Math, Object.keys(pagination));
  let length = maxOffset + pagination[maxOffset].length;
  let offsets = sortBy(Object.keys(pagination).map(v => parseInt(v)));
  let flatValues = offsets
    .reduce((memo, offset) => {
      pagination[offset].forEach((id, i) => {
        memo[offset + i] = id;
      });
      return memo;
    }, Array(length));
  return chunked(flatValues, newLimit).reduce((obj, ids, i) => {
    ids = filter(ids);
    if (ids.length) {
      obj[i * newLimit] = ids;
    }
    return obj;
  }, {});
}

function firstLesserOffset(pagination, offset) {
  let offsets = Object.keys(pagination).map(v => parseInt(v)).sort().reverse();
  for (let o of offsets) {
    if (parseInt(o) < offset) {
      return o;
    }
  }
  return 0;
}