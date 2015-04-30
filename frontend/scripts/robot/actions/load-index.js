// IMPORTS =========================================================================================
import Axios from "axios";

import {toObject} from "shared/common/helpers";
import state from "frontend/common/state";
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

  let ids = pagination[offset];
  if (!ids || ids.length < limit) {
    fetchIndex(filters, sorts, offset, limit);
  }
}

function isMaxOffset(pagination, offset) {
  return offset == Math.max.apply(Math, Object.keys(pagination).map(v => parseInt(v)));
}