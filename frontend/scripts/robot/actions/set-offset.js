// IMPORTS =========================================================================================
import state, {ROBOT} from "frontend/state";

// ACTIONS =========================================================================================
export default function setOffset(offset=ROBOT.OFFSET) {
  console.debug(`setOffset(${offset})`);

  let cursor = state.select("robots");
  if (offset != cursor.get("offset")) {
    cursor.set("offset", offset);
    state.commit();
  }
}