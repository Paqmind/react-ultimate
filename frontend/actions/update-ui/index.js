import {equals} from "ramda";
import {recommendOffset} from "frontend/helpers/pagination";

function _updateUIFilters(UICursor, settings, newFilters) {
  if (!equals(newFilters || settings.index.filters, UICursor.get("filters"))) {
    UICursor.set("filters", newFilters || settings.index.filters);
    if (true || !UICursor.get("fullLoad")) {
      /* TODO replace true with __newFilters_are_not_subset_of_oldFilters__ */
      // Pagination is messed up, do reset
      UICursor.merge({
        ids: [],
      });
    }
  }
}

function _updateUISorts(UICursor, settings, newSorts) {
  if (!equals(newSorts || settings.index.sorts, UICursor.get("sorts"))) {
    UICursor.set("sorts", newSorts || settings.index.sorts);
    if (!UICursor.get("fullLoad")) {
      // Pagination is messed up, do reset
      UICursor.merge({
        ids: [],
      });
    }
  }
}

function _updateUIPagination(UICursor, settings, newOffset, newLimit) {
  let {offset, limit, ids} = UICursor.get();

  newOffset = newOffset !== undefined ? newOffset : offset;
  newLimit = newLimit !== undefined ? newLimit : limit;

  if (!equals(newLimit, limit)) {
    UICursor.set("limit", newLimit || settings.index.limit);
  }

  if (!equals(newLimit, limit) || !equals(newOffset, offset)) {
    if (ids.length) {
      let recommendedOffset = recommendOffset(ids.length, newOffset, newLimit);
      if (newOffset > recommendedOffset) {
        newOffset = recommendedOffset;
      }
    }
    UICursor.set("offset", newOffset || settings.index.offset);
  }
}

export default {
  _updateUIFilters,
  _updateUISorts,
  _updateUIPagination
};
