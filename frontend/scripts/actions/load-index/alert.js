// IMPORTS =========================================================================================
import {filter} from "ramda";
import Axios from "axios";
import {toObject} from "shared/helpers/common";
import state from "frontend/state";
import fetchIndex from "frontend/actions/fetch-index/alert";

// ACTIONS =========================================================================================
export default function loadIndex() {
  console.debug("loadIndex()");

  let cursor = state.select("alerts");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");
  let total = cursor.get("total");
  let models = cursor.get("models");

  let ids = Object.keys(models);
  if (!ids) {
    fetchIndex(filters, sorts, offset, limit, models);
  }
}
