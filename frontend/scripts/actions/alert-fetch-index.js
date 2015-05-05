// IMPORTS =========================================================================================
import Axios from "axios";
import {formatQuery} from "shared/helpers/jsonapi";
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug("fetchIndex()");

  let cursor = state.select("alerts");

  let url = `api/alerts`;
  let query = formatQuery(filters, sorts, offset, limit);

  cursor.merge({
    loading: false,
    loadError: undefined,
    total: 0,
    models: {},
  });

  return Promise.resolve(200); // HTTP response.status
}