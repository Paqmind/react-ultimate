// IMPORTS =========================================================================================
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function viewModel(newId) {
  console.debug(`viewModel(${newId})`);

  let cursor = state.select("robots");
  let id = cursor.get("id");

  if (newId != id) {
    cursor.set("id", newId);
  }

  return newId;
}
