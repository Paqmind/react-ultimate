// IMPORTS =========================================================================================
import isEqual from "lodash.isequal";
import state, {ROBOT} from "frontend/common/state";

// ACTIONS =========================================================================================
export default function setSorts(sorts=ROBOT.SORTS) {
  console.debug(`setSorts(${JSON.stringify(sorts)})`);

  let cursor = state.select("robots");

  if (!isEqual(sorts, cursor.get("sorts"))) {
    cursor.set("sorts", sorts);
    // TODO reevaluate pagination
    cursor.set("pagination", {});
    state.commit();
  }
}

// SORT
//if (sorts) {
//  models = sortByOrder(models, ...lodashifySorts(sorts));
//}