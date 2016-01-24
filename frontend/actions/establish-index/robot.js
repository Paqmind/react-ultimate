import {equals, filter} from "ramda";
import {ROBOT} from "shared/constants";
import api from "shared/api/robot";
import state from "frontend/state";
import loadIndex from "frontend/actions/load-index/robot";

let urlCursor = state.select("url");
let urlQueryCursor = state.select("urlQuery");
let UICursor = state.select("UI", api.plural);

export default function establishIndex() {
  console.debug(api.plural + `.establishIndex()`);

  let urlQuery = urlQueryCursor.get();
  let urlFilters = urlQuery.filters;
  let urlSorts = urlQuery.sorts;
  let urlOffset = urlQuery.offset;
  let urlLimit = urlQuery.limit;

  let {filters, sorts} = UICursor.get();

  if (!equals(urlFilters || ROBOT.index.filters, filters)) {
    UICursor.set("filters", urlFilters || ROBOT.index.filters);
    if (true || !UICursor.get("fullLoad")) {
      /* TODO replace true with __newFilters_are_not_subset_of_oldFilters__ */
      // Pagination is messed up, do reset
      UICursor.merge({
        total: 0,
        pagination: [],
      });
    }
  }
  if (!equals(urlSorts || ROBOT.index.sorts, sorts)) {
    UICursor.set("sorts", urlSorts || ROBOT.index.sorts);
    if (!UICursor.get("fullLoad")) {
      // Pagination is messed up, do reset
      UICursor.merge({
        total: 0,
        pagination: [],
      });
    }
  }
  UICursor.set("offset", urlOffset || ROBOT.index.offset);
  UICursor.set("limit", urlLimit || ROBOT.index.limit);

  return loadIndex();
}
