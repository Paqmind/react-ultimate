// IMPORTS =========================================================================================
import Axios from "axios";
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function fetchModel(id) {
  console.debug(`fetchModel(${id})`);

  let cursor = state.select("alerts");
  cursor.set("loading", true);

  let url = `/api/alerts/${id}`;

  // TODO
}