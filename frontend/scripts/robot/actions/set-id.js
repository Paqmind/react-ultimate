// IMPORTS =========================================================================================
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function setId(id) {
  console.debug(`setId(${id})`);

  let cursor = state.select("robots");
  if (id != cursor.get("id")) {
    cursor.set("id", id);
    state.commit();
  }
}