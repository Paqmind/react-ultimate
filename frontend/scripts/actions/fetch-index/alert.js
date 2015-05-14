// IMPORTS =========================================================================================
import Axios from "axios";
import {formatQuery} from "shared/helpers/jsonapi";
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function fetchIndex() {
  console.debug("fetchIndex()");

  let cursor = state.select("alerts");

  let url = `/api/alerts/`;
  // TODO
  // let query = formatQuery({filters, sorts, page: {offset, limit}});

  cursor.merge({
    loading: false,
    loadError: undefined,
    total: 0,
    models: {},
  });

  // TODO

  return Promise.resolve(200); // HTTP response.status
}