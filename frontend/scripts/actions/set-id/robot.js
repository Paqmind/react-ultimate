// IMPORTS =========================================================================================
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function setId(newId) {
  console.debug(`setId(${newId})`);

  let cursor = state.select("robots");
  let id = cursor.get("id");

  if (newId != id) {
    cursor.set("id", newId);
    state.commit();
  }

  return newId;
}