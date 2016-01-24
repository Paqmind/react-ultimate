import {assoc, reduce} from "ramda";
import api from "shared/api/monster";
import {inCache, getTotalPages, recommendOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import fetchIndex from "frontend/actions/fetch-index/monster";

let DBCursor = state.select("DB", api.plural);
let UICursor = state.select("UI", api.plural);

export default function loadIndex() {
  console.debug(api.plural + ".loadIndex()");

  let {filters, sorts, offset, limit, total, pagination} = UICursor.get();

  if (total) {
    let recommendedOffset = recommendOffset(total, offset, limit);
    if (offset > recommendedOffset) {
      offset = UICursor.set("offset", recommendedOffset);
      return loadIndex(filters, sorts, offset, limit);
    } else {
      if (inCache(offset, limit, total, pagination)) {
        // return cached items
        return Promise.resolve(reduce(
          (memo, id) => assoc(memo, id, DBCursor.get(id)),
          {}, pagination.slice(offset, offset + limit)
        ));
      } else {
        return fetchIndex(filters, sorts, offset, limit);
      }
    }
  } else {
    return fetchIndex(filters, sorts, offset, limit)
      .then(() => {
        let {filters, sorts, offset, limit, total, pagination} = UICursor.get();

        if (total) {
          let recommendedOffset = recommendOffset(total, offset, limit);
          if (offset > recommendedOffset) {
            offset = UICursor.set("offset", recommendedOffset);
            return loadIndex(filters, sorts, offset, limit);
          }
        }
        // return fetched items
        return reduce(
          (memo, id) => assoc(memo, id, DBCursor.get(id)),
          {}, pagination.slice(offset, offset + limit)
        );
    });
  }
}
