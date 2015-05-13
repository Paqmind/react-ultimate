// IMPORTS =========================================================================================
import {filter} from "ramda";
import Axios from "axios";
import {getTotalPages, recommendOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import router from "frontend/router";
import setOffset from "frontend/actions/set-offset/monster";
import fetchIndex from "frontend/actions/fetch-index/monster";

// ACTIONS =========================================================================================
export default function loadIndex() {
  console.debug("loadIndex()");

  handleUnexistingOffset();
  if (!isCacheAvailable()) {
    fetchIndex().then(handleUnexistingOffset);
  }
}

export function isCacheAvailable() {
  let cursor = state.select("monsters");
  let total = cursor.get("total");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");
  let pagination = cursor.get("pagination");

  let ids = filter(v => v, pagination.slice(offset, offset + limit));
  if (ids && ids.length) {
    if (offset == recommendOffset(total, offset, limit)) {
      let totalPages = getTotalPages(total, limit);
      return ids.length >= limit - ((totalPages * limit) - total);
    } else {
      return ids.length >= limit;
    }
  } else {
    return false;
  }
}

function handleUnexistingOffset() {
  let cursor = state.select("monsters");
  let total = cursor.get("total");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");

  if (total) {
    let recommendedOffset = recommendOffset(total, offset, limit);
    setOffset(recommendedOffset);
  }
}
