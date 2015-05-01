// IMPORTS =========================================================================================
import filter from "lodash.filter";
import sortBy from "lodash.sortby";

import {chunked, findFirstLesserOffset} from "shared/common/helpers";
import state, {ROBOT} from "frontend/common/state";
import router from "frontend/common/router";

// ACTIONS =========================================================================================
export default function setLimit(limit=ROBOT.LIMIT) {
  console.debug(`setLimit(${limit})`);

  let cursor = state.select("robots");
  if (limit != cursor.get("limit")) {
    cursor.set("limit", limit);
    console.debug("Recalculating pagination...");
    let pagination = recalculatePaginationWithLimit(
      cursor.get("pagination"), limit
    );
    cursor.set("pagination", pagination);
    state.commit();
  }
}

// HELPERS =========================================================================================
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
function recalculatePaginationWithLimit(pagination, limit) {
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