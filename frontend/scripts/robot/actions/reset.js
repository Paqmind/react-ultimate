// IMPORTS =========================================================================================
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function reset() {
  console.debug(`reset`);

  state.select("robots").set("pagination", {});
  state.select("robots").set("total", 0);
}