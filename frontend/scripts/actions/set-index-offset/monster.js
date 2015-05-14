// IMPORTS =========================================================================================
import state, {MONSTER} from "frontend/state";

// ACTIONS =========================================================================================
export default function setIndexOffset(newOffset=MONSTER.OFFSET) {
  console.debug(`setIndexOffset(${newOffset})`);

  let cursor = state.select("monsters");
  let offset = cursor.get("offset");

  if (newOffset != offset) {
    cursor.set("offset", newOffset);
  }

  return newOffset;
}