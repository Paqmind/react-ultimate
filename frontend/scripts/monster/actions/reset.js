// IMPORTS =========================================================================================
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function reset() {
  console.debug(`reset`);

  state.select("monsters").set("pagination", {});
  state.select("monsters").set("total", 0);
  state.commit();
}