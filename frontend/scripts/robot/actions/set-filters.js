// IMPORTS =========================================================================================
import isEqual from "lodash.isequal";
import state, {ROBOT} from "frontend/common/state";

// ACTIONS =========================================================================================
export default function setFilters(filters=ROBOT.FILTERS) {
  console.debug(`setFilters(${JSON.stringify(filters)}`);

  let cursor = state.select("robots");
  if (!isEqual(filters, cursor.get("filters"))) {
    cursor.set("filters", filters);
    // TODO reevaluate pagination
    cursor.set("pagination", {});
    state.commit();
  }
}

// FILTER
//if (filters) {
//  Object.keys(filters).each(key => {
//    models = models.filter(model => model[key] === filters[key]);
//  });
//}