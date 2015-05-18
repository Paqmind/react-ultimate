// IMPORTS =========================================================================================
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function removeModel(id) {
  let url = `/api/alerts/${id}`;

  // Non-persistent remove
  state.select("alerts", "models").unset(id);
}
