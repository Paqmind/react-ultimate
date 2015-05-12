// IMPORTS =========================================================================================
import Axios from "axios";
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function fetchModel() {
  console.debug("fetchModel()");

  let cursor = state.select("alerts");
  cursor.set("loading", true);
  let id = cursor.get("id");

  let url = `/api/alerts/${id}`;

  // TODO
}