// IMPORTS =========================================================================================
import state, {ZOMBIE} from "frontend/state";

// ACTIONS =========================================================================================
export default function setPagination(pagination) {
  console.debug(`setPagination(${pagination})`);

  let cursor = state.select("monsters");
  if (pagination != cursor.get("pagination")) {
    cursor.set("pagination", pagination);
    state.commit();
  }
}