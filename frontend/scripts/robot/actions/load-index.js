// IMPORTS =========================================================================================
import Axios from "axios";

import {toObject, findFirstLesserOffset, flattenArrayGroup} from "shared/common/helpers";
import state from "frontend/common/state";
import router from "frontend/common/router";
import fetchIndex from "./fetch-index";

// ACTIONS =========================================================================================
export default function loadIndex() {
  console.debug("loadIndex");

  let cursor = state.select("robots");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");
  let pagination = cursor.get("pagination");
  let allRobotsAreLoaded = state.facets.allRobotsAreLoaded.get();

  let ids = pagination[offset];
  let useCache = (ids && ids.length >= limit) || allRobotsAreLoaded;
  if (!useCache) {
    fetchIndex(filters, sorts, offset, limit).then(status => {
      if (offset > cursor.get("total")) {
        console.debug("Offset > max. Performing redirect");
        let offset = findFirstLesserOffset(pagination, offset);
        router.transitionTo(
          undefined,       // route
          undefined,       // params
          undefined,       // query
          {},              // withParams
          {page: {offset}} // withQuery
        );
      }
    });
  }
}

function isMaxOffset(pagination, offset) {
  return offset == Math.max.apply(Math, Object.keys(pagination).map(v => parseInt(v)));
}