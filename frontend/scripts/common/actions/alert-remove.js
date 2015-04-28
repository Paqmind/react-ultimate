// IMPORTS =========================================================================================
import state from "frontend/common/state";

// ACTIONS =========================================================================================
export default function remove(id) {
  let apiURL = `/api/alerts/${id}`;

  // Non-persistent remove
  state.select("alerts", "models").unset(id);
}