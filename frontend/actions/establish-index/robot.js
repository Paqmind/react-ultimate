import {eqDeep, filter} from "ramda";
import api from "shared/api/robot";
import state, {ROBOT} from "frontend/state";
import loadIndex from "frontend/actions/load-index/robot";

// CURSORS =========================================================================================
let $url = state.select("url");
let $urlQuery = state.select("$urlQuery");
let $data = state.select(api.plural);

// ACTIONS =========================================================================================
export default function establishIndex() {
  console.debug(api.plural + `.establishIndex()`);

  let urlQuery = $urlQuery.get();
  let urlFilters = urlQuery.filters;
  let urlSorts = urlQuery.sorts;
  let urlOffset = urlQuery.offset;
  let urlLimit = urlQuery.limit;

  let {filters, sorts} = $data.get();

  if (!eqDeep(urlFilters || ROBOT.FILTERS, filters)) {
    $data.set("filters", urlFilters || ROBOT.FILTERS);
    if (true || !state.get("$allRobotsAreLoaded")) {
      /* TODO replace true with __newFilters_are_not_subset_of_oldFilters__ */
      // Pagination is messed up, do reset
      $data.set("total", 0);
      $data.set("pagination", []);
    }
  }
  if (!eqDeep(urlSorts || ROBOT.SORTS, sorts)) {
    $data.set("sorts", urlSorts || ROBOT.SORTS);
    if (!state.get("$allRobotsAreLoaded")) {
      // Pagination is messed up, do reset
      $data.set("total", 0);
      $data.set("pagination", []);
    }
  }
  $data.set("offset", urlOffset || ROBOT.OFFSET);
  $data.set("limit", urlLimit || ROBOT.LIMIT);

  return loadIndex();
}
