import {assoc, reduce} from "ramda";
import {inCache} from "frontend/helpers/pagination";
import state from "frontend/state";
import fetchIndex from "frontend/actions/fetch-index/index";

// Cursor, Cursor, Type, Api -> Promise
export default function loadIndex(DBCursor, UICursor, Type, api) {
  console.debug(api.plural + ".loadIndex()");

  let {offset, limit, total, ids} = UICursor.get();

  if (inCache(offset, limit, total, ids)) {
    // return cached items
    return Promise.resolve();
  } else {
    return fetchIndex(DBCursor, UICursor, Type, api);
  }
}
