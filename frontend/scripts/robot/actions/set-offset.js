// IMPORTS =========================================================================================
import state, {ROBOT} from "frontend/state";

// ACTIONS =========================================================================================
export default function setOffset(newOffset=ROBOT.OFFSET) {
  console.debug(`setOffset(${newOffset})`);

  let cursor = state.select("robots");
  let offset = cursor.get("offset");

  if (newOffset != offset) {
    cursor.set("offset", newOffset);
    state.commit();
  }

  return newOffset;
}