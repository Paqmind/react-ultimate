// IMPORTS =========================================================================================
import state, {ROBOT} from "frontend/state";

// ACTIONS =========================================================================================
export default function setPagination(pagination) {
  console.debug(`setPagination(${pagination})`);

  let cursor = state.select("robots");
  if (pagination != cursor.get("pagination")) {
    cursor.set("pagination", pagination);
    state.commit();
  }
}