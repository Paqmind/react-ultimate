import {assoc, reduce} from "ramda";
import api from "shared/api/monster";
import {inCache, getTotalPages, recommendOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import fetchIndex from "frontend/actions/fetch-index/monster";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $models = $data.select("models");

// ACTIONS =========================================================================================
export default function loadIndex() {
  console.debug(api.plural + ".loadIndex()");

  let {filters, sorts, offset, limit, total, pagination} = $data.get();

  if (total) {
    let recommendedOffset = recommendOffset(total, offset, limit);
    if (offset > recommendedOffset) {
      offset = $data.set("offset", recommendedOffset);
      return loadIndex(filters, sorts, offset, limit);
    } else {
      if (inCache(offset, limit, total, pagination)) {
        // return cached models
        return Promise.resolve(reduce(
          (memo, id) => assoc(memo, id, $models.get(id)),
          {}, pagination.slice(offset, offset + limit)
        ));
      } else {
        return fetchIndex(filters, sorts, offset, limit);
      }
    }
  } else {
    return fetchIndex(filters, sorts, offset, limit)
      .then(() => {
        let {filters, sorts, offset, limit, total, pagination} = $data.get();

        if (total) {
          let recommendedOffset = recommendOffset(total, offset, limit);
          if (offset > recommendedOffset) {
            offset = $data.set("offset", recommendedOffset);
            return loadIndex(filters, sorts, offset, limit);
          }
        }
        // return fetched models
        return reduce(
          (memo, id) => assoc(memo, id, $models.get(id)),
          {}, pagination.slice(offset, offset + limit)
        );
    });
  }
}
