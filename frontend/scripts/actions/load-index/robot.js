// IMPORTS =========================================================================================
import {filter} from "ramda";
import Axios from "axios";
import {getTotalPages, getMaxOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import {indexRouter} from "frontend/router";
import fetchIndex from "frontend/actions/fetch-index/robot";

// ACTIONS =========================================================================================
export default function loadIndex() {
  console.debug("loadIndex()");

  let cursor = state.select("robots");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");
  let total = cursor.get("total");
  let models = cursor.get("models");
  let pagination = cursor.get("pagination");

  if (total) {
    let maxOffset = getMaxOffset(total, limit);
    if (offset > maxOffset) {
      indexRouter.transitionTo(undefined, {offset: maxOffset});
    } else {
      if (!isCacheAvailable(total, offset, limit, pagination)) {
        fetchIndex(filters, sorts, offset, limit, models, pagination);
      }
    }
  } else {
    fetchIndex(filters, sorts, offset, limit, models, pagination)
      .then(() => {
        let newTotal = cursor.get("total");
        if (newTotal) {
          let maxOffset = getMaxOffset(newTotal, limit);
          if (offset > maxOffset) {
            indexRouter.transitionTo(undefined, {offset: maxOffset});
          }
        }
      });
  }
}

export function isCacheAvailable(total, offset, limit, pagination) {
  let ids = filter(v => v, pagination.slice(offset, offset + limit));
  if (ids && ids.length) {
    if (offset == getMaxOffset(total, limit)) { // are we on the last page?
      let totalPages = getTotalPages(total, limit);
      return ids.length >= limit - ((totalPages * limit) - total);
    } else {
      return ids.length >= limit;
    }
  } else {
    return false;
  }
}
