import {equals} from "ramda";
import {recommendOffset} from "frontend/helpers/pagination";

export default function updateUI(UICursor, settings, {newFilters, newSorts, newOffset, newLimit}) {
  let {filters, sorts, offset, limit, total} = UICursor.get();

  newFilters = newFilters !== undefined ? newFilters : filters;
  newSorts = newSorts !== undefined ? newSorts : sorts;
  newOffset = newOffset !== undefined ? newOffset : offset;
  newLimit = newLimit !== undefined ? newLimit : limit;

  if (!equals(newFilters || settings.index.filters, filters)) {
      UICursor.set("filters", newFilters || settings.index.filters);
      if (true || !UICursor.get("fullLoad")) {
        /* TODO replace true with __newFilters_are_not_subset_of_oldFilters__ */
        // Pagination is messed up, do reset
        UICursor.merge({
          total: 0,
          ids: [],
        });
      }
    }
  if (!equals(newSorts || settings.index.sorts, sorts)) {
    UICursor.set("sorts", newSorts || settings.index.sorts);
    if (!UICursor.get("fullLoad")) {
      // Pagination is messed up, do reset
      UICursor.merge({
        total: 0,
        ids: [],
      });
    }
  }

  if (!equals(newLimit, limit)) {
    UICursor.set("limit", newLimit || settings.index.limit);
  }

  if (!equals(newLimit, limit) || !equals(newOffset, offset)) {
    if (total) {
      let recommendedOffset = recommendOffset(total, newOffset, newLimit);
      if (newOffset > recommendedOffset) {
        newOffset = recommendedOffset;
      }
    }
    UICursor.set("offset", newOffset || settings.index.offset);
  }
}
