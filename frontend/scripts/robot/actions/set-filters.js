// IMPORTS =========================================================================================
import state from "frontend/common/state";
import loadIndex from "./load-index";

// ACTIONS =========================================================================================
export default function setFilters(filters) {
  console.debug("setFilters:", filters);

  let cursor = state.select("robots");
  cursor.set("filters", filters);
  // TODO reevaluate pagination
  cursor.set("pagination", []);
  state.commit();

  loadIndex();
}

// FILTER
//if (filters) {
//  Object.keys(filters).each(key => {
//    models = models.filter(model => model[key] === filters[key]);
//  });
//}