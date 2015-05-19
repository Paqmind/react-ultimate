// IMPORTS =========================================================================================
import Axios from "axios";
import {formatQuery} from "shared/helpers/jsonapi";
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function fetchIndex(filters, sorts, offset, limit, models) {
  console.debug("fetchIndex(...)");
  let url = `/api/alerts/`;

  let cursor = state.select("alerts");

  // TODO
  // let query = formatQuery({filters, sorts, offset, limit});

  cursor.merge({
    loading: false,
    loadError: undefined,
    total: 0,
    models: {},
  });

  // TODO

  return Promise.resolve(200); // HTTP response.status
}