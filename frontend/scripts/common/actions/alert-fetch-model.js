// IMPORTS =========================================================================================
import Axios from "axios";

import state from "frontend/common/state";

// ACTIONS =========================================================================================
export default function fetchModel(id) {
  console.debug("fetchModel:", id);

  let url = `/api/alerts/${id}`;
  let cursor = state.select("alerts");

  cursor.set("loading", false);

  return Promise.resolve(200); // HTTP response.status
}