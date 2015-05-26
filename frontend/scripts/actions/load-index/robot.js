// IMPORTS =========================================================================================
import {filter, slice} from "ramda";
import Axios from "axios";
import {inCache, getTotalPages, recommendOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import {indexRouter} from "frontend/router";
import fetchIndex from "frontend/actions/fetch-index/robot";

// CURSORS =========================================================================================
let modelCursor = state.select("robots");

// ACTIONS =========================================================================================
export default function loadIndex() {
  console.debug("loadIndex()");

  let filters = modelCursor.get("filters");
  let sorts = modelCursor.get("sorts");
  let offset = modelCursor.get("offset");
  let limit = modelCursor.get("limit");
  let total = modelCursor.get("total");
  let models = modelCursor.get("models");
  let pagination = modelCursor.get("pagination");

  if (total) {
    let recommendedOffset = recommendOffset(total, offset, limit);
    if (offset > recommendedOffset) {
      indexRouter.transitionTo(undefined, {offset: recommendedOffset});
    } else {
      if (!inCache(offset, limit, total, pagination)) {
        fetchIndex(filters, sorts, offset, limit);
      }
    }
  } else {
    fetchIndex(filters, sorts, offset, limit)
      .then(() => {
        let newTotal = modelCursor.get("total");
        if (newTotal) {
          let recommendedOffset = recommendOffset(newTotal, offset, limit);
          if (offset > recommendedOffset) {
            indexRouter.transitionTo(undefined, {offset: recommendedOffset});
          }
        }
      });
  }
}
