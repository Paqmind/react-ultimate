// IMPORTS =========================================================================================
import state, {MONSTER} from "frontend/state";

// ACTIONS =========================================================================================
export default function setOffset(newOffset=MONSTER.OFFSET) {
  console.debug(`setOffset(${newOffset})`);

  let cursor = state.select("monsters");
  let offset = cursor.get("offset");

  if (newOffset != offset) {
    cursor.set("offset", newOffset);
    state.commit();
  }

  return newOffset;
}