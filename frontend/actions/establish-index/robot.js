import {eqDeep, filter} from "ramda";
import api from "shared/api/robot";
import {ROBOT} from "frontend/constants";
import state from "frontend/state";
import loadIndex from "frontend/actions/load-index/robot";

let url$ = state.select("url");
let urlQuery$ = state.select("urlQuery");
let data$ = state.select(api.plural);

export default function establishIndex() {
  console.debug(api.plural + `.establishIndex()`);

  let urlQuery = urlQuery$.get();
  let urlFilters = urlQuery.filters;
  let urlSorts = urlQuery.sorts;
  let urlOffset = urlQuery.offset;
  let urlLimit = urlQuery.limit;

  let {filters, sorts} = data$.get();

  if (!eqDeep(urlFilters || ROBOT.index.filters, filters)) {
    data$.set("filters", urlFilters || ROBOT.index.filters);
    if (true || !data$.get("fullLoad")) {
      /* TODO replace true with __newFilters_are_not_subset_of_oldFilters__ */
      // Pagination is messed up, do reset
      data$.set("total", 0);
      data$.set("pagination", []);
    }
  }
  if (!eqDeep(urlSorts || ROBOT.index.sorts, sorts)) {
    data$.set("sorts", urlSorts || ROBOT.index.sorts);
    if (!data$.get("fullLoad")) {
      // Pagination is messed up, do reset
      data$.set("total", 0);
      data$.set("pagination", []);
    }
  }
  data$.set("offset", urlOffset || ROBOT.index.offset);
  data$.set("limit", urlLimit || ROBOT.index.limit);

  return loadIndex();
}
