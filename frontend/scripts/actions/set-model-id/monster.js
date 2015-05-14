// IMPORTS =========================================================================================
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function setModelId(newId) {
  console.debug(`setModelId(${newId})`);

  let cursor = state.select("monsters");
  let id = cursor.get("id");

  if (newId != id) {
    cursor.set("id", newId);
  }

  return newId;
}
