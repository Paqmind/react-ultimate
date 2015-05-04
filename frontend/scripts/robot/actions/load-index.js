// IMPORTS =========================================================================================
import Axios from "axios";
import {isCacheAvailable, getLastOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import router from "frontend/router";
import fetchIndex from "./fetch-index";

// ACTIONS =========================================================================================
export default function loadIndex() {
  console.debug("loadIndex");

  let cursor = state.select("robots");
  let total = cursor.get("total");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");
  let pagination = cursor.get("pagination");
  let lastOffset = getLastOffset(total, limit);

  if (offset && offset > lastOffset) {
    router.transitionTo(
      undefined,                   // route
      undefined,                   // params
      undefined,                   // query
      {},                          // withParams
      {page: {offset: lastOffset}} // withQuery
    );
  } else {
    if (!isCacheAvailable(total, pagination, offset, limit)) {
      fetchIndex(filters, sorts, offset, limit);
    }
  }
}
