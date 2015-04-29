// IMPORTS =========================================================================================
import state from "frontend/common/state";

// ACTIONS =========================================================================================
export default function setOffset(id) {
  console.debug(`setId(${id})`);

  let cursor = state.select("robots");
  if (id != cursor.get("id")) {
    cursor.set("id", id);
    state.commit();
  }
}