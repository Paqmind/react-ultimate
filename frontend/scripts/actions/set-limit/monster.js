// IMPORTS =========================================================================================
import state, {MONSTER} from "frontend/state";
import router from "frontend/router";

// ACTIONS =========================================================================================
export default function setLimit(newLimit=MONSTER.LIMIT) {
  console.debug(`setLimit(${newLimit})`);

  let cursor = state.select("monsters");
  let limit = cursor.get("limit");
  let pagination = cursor.get("pagination");

  if (newLimit != limit) {
    cursor.set("limit", newLimit);
  }

  return newLimit;
}
