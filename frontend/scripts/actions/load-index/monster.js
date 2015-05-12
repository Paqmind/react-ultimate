// IMPORTS =========================================================================================
import Axios from "axios";
import {isCacheAvailable, getLastOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import router from "frontend/router";
import setOffset from "./set-offset";
import fetchIndex from "./fetch-index";

// ACTIONS =========================================================================================
export default function loadIndex() {
  console.debug("loadIndex()");

  let cursor = state.select("monsters");
  let total = cursor.get("total");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");
  let pagination = cursor.get("pagination");
  let lastOffset = getLastOffset(total, limit);

  if (offset && offset > lastOffset) {
    setOffset(lastOffset);
  }
  if (!isCacheAvailable(total, pagination, offset, limit)) {
    fetchIndex();
  }
}
