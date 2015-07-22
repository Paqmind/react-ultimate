import api from "shared/api/alert";
import state from "frontend/state";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $models = $data.select("models");

// ACTIONS =========================================================================================
export default function fetchModel(id) {
  // TODO
}
