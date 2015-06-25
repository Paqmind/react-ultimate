import {eqDeep, filter} from "ramda";
import state, {ROBOT} from "frontend/state";
import loadIndex from "frontend/actions/load-index/robot";

// CURSORS =========================================================================================
let urlCursor = state.select("url");
let modelCursor = state.select("robots");

// ACTIONS =========================================================================================
export default function establishIndex() {
  console.debug("establishIndex");

  let urlFilters = urlCursor.get("filters");
  let urlSorts = urlCursor.get("sorts");
  let urlOffset = urlCursor.get("offset");
  let urlLimit = urlCursor.get("limit");

  let filters = modelCursor.get("filters");
  let sorts = modelCursor.get("sorts");

  let allModelsAreLoaded = state.facets.allRobotsAreLoaded.get();

  if (!eqDeep(urlFilters || ROBOT.FILTERS, filters)) {
    modelCursor.set("filters", urlFilters || ROBOT.FILTERS);
    if (true || !allModelsAreLoaded) {
      /* TODO replace true with __newFilters_are_not_subset_of_oldFilters__ */
      // Pagination is messed up, do reset
      modelCursor.set("total", 0);
      modelCursor.set("pagination", []);
    }
  }
  if (!eqDeep(urlSorts || ROBOT.SORTS, sorts)) {
    modelCursor.set("sorts", urlSorts || ROBOT.SORTS);
    if (!allModelsAreLoaded) {
      // Pagination is messed up, do reset
      modelCursor.set("total", 0);
      modelCursor.set("pagination", []);
    }
  }
  modelCursor.set("offset", urlOffset || ROBOT.OFFSET);
  modelCursor.set("limit", urlLimit || ROBOT.LIMIT);

  loadIndex();
}
