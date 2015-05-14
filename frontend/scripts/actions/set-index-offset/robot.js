// IMPORTS =========================================================================================
import state, {ROBOT} from "frontend/state";

// ACTIONS =========================================================================================
export default function setIndexOffset(newOffset=ROBOT.OFFSET) {
  console.debug(`setIndexOffset(${newOffset})`);

  let cursor = state.select("robots");
  let offset = cursor.get("offset");

  if (newOffset != offset) {
    cursor.set("offset", newOffset);
  }

  return newOffset;
}