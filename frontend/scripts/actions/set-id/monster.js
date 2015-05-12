// IMPORTS =========================================================================================
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function setId(newId) {
  console.debug(`setId(${newId})`);

  let cursor = state.select("monsters");
  let id = cursor.get("id");

  if (newId != id) {
    cursor.set("id", newId);
  }

  return newId;
}
