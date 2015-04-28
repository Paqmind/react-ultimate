// IMPORTS =========================================================================================
import Axios from "axios";

import {toObject, formatJsonApiQuery} from "frontend/common/helpers";
import state from "frontend/common/state";
import fetchIndex from "./alert-fetch-index";

// ACTIONS =========================================================================================
export default function loadIndex() {
  console.debug("loadIndex");

  let cursor = state.select("alerts");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");
  let pagination = cursor.get("pagination");

  let ids = pagination[offset];
  if (!ids) {
    fetchIndex(filters, sorts, offset, limit);
  }
}
