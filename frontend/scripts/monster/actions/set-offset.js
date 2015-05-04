// IMPORTS =========================================================================================
import state, {ZOMBIE} from "frontend/state";

// ACTIONS =========================================================================================
export default function setOffset(offset=ZOMBIE.OFFSET) {
  console.debug(`setOffset(${offset})`);

  let cursor = state.select("monsters");
  if (offset != cursor.get("offset")) {
    cursor.set("offset", offset);
    state.commit();
  }
}