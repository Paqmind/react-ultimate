// IMPORTS =========================================================================================
import filter from "lodash.filter";
import sortBy from "lodash.sortby";

import {chunked} from "shared/common/helpers";
import {formatJsonApiQuery} from "frontend/common/helpers";
import state, {ROBOT} from "frontend/common/state";
import router from "frontend/common/router";

// ACTIONS =========================================================================================
export default function setLimit(limit=ROBOT.LIMIT) {
  console.debug("setLimit(" + limit + ")");

  let cursor = state.select("robots");
  if (limit != cursor.get("limit")) {
    let pagination = recalculatePaginationWithLimit(cursor.get("pagination"), limit);
    cursor.set("limit", limit);
    cursor.set("pagination", pagination);
    if (!pagination[cursor.get("offset")]) {
      let offset = firstLesserOffset(pagination, cursor.get("offset"));
      let query = formatJsonApiQuery({offset});
      router.transitionTo(undefined, undefined, query);
    }
    state.commit();
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
  if (Object.keys(pagination).length) {
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
  } else {
    return {};
  }
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