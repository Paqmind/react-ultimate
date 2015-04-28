// IMPORTS =========================================================================================
import state from "frontend/common/state";
import loadIndex from "./load-index";

// ACTIONS =========================================================================================
export default function setSorts(sorts) {
  console.debug("setSorts:", sorts);

  let cursor = state.select("robots");
  cursor.set("sorts", sorts);
  // TODO reevaluate pagination
  cursor.set("pagination", []);
  state.commit();

  loadIndex();
}

// SORT
//if (sorts) {
//  models = sortByOrder(models, ...lodashifySorts(sorts));
//}