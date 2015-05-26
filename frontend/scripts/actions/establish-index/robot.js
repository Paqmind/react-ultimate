// IMPORTS =========================================================================================
import {eqDeep, filter} from "ramda";
import state, {ROBOT} from "frontend/state";
import loadIndex from "frontend/actions/load-index/robot";

// ACTIONS =========================================================================================
export default function establishIndex() {
  console.debug("establishIndex");

  let urlCursor = state.select("url");
  let modelCursor = state.select("robots");
  let urlFilters = urlCursor.get("filters");
  let urlSorts = urlCursor.get("sorts");
  let urlOffset = urlCursor.get("offset");
  let urlLimit = urlCursor.get("limit");
  let filters = modelCursor.get("filters");
  let sorts = modelCursor.get("sorts");
  let models = modelCursor.get("models");
  let total = modelCursor.get("total");
  let pagination = modelCursor.get("pagination");

  if (!eqDeep(urlFilters || ROBOT.FILTERS, filters)) {
    modelCursor.set("filters", urlFilters || ROBOT.FILTERS);
    if (filter(x => x, pagination) < total || true) {
      /* TODO replace true with __newFilters_are_not_subset_of_oldFilters__ */
      // not all data loaded or new filters aren't subset of old
      modelCursor.set("pagination", []);
      modelCursor.set("total", 0);
    }
  }
  if (!eqDeep(urlSorts || ROBOT.SORTS, sorts)) {
    modelCursor.set("sorts", urlSorts || ROBOT.SORTS);
    if (filter(x => x, pagination) < total) {
      // not all data loaded
      modelCursor.set("pagination", []);
      modelCursor.set("total", 0);
    }
  }
  modelCursor.set("offset", urlOffset || ROBOT.OFFSET);
  modelCursor.set("limit", urlLimit || ROBOT.LIMIT);

  loadIndex();
}
