import {assoc, curry, map, range, reduce, repeat, update} from "ramda";
import ajax from "frontend/ajax";
import {inCache} from "frontend/helpers/pagination";
import state from "frontend/state";
import {toObject} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import {parseAs} from "shared/parsers";


// Cursor, Type, Api -> Promise
function loadIndex(UICursor, Type, api) {
  console.debug(api.plural + ".loadIndex()");

  let {ids, filters, sorts, offset, limit} = UICursor.get();

  // if items are already loaded
  if (inCache(offset, limit, ids)) return Promise.resolve(UICursor.get("currentItems"));

  let DBCursor = state.select("DB", UICursor.get("DBCursorName"));
  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return ajax.get(api.indexUrl, {params: query})
    .then(response => {
      if (response.status.startsWith("2")) {
        let newItemsArray = map(t => parseAs(Type, t), response.data.data);
        let newItems = toObject(newItemsArray);
        DBCursor.merge(newItems);

        let newTotal = response.data.meta.page.total;

        let newIds = ids;
        if (newIds.length != newTotal) {
          newIds = repeat(null, newTotal); // init ids with empty values
        }
        newIds = reduce((memo, i) => {
            return update(offset + parseInt(i), newItemsArray[i].id, memo);
          }, newIds, Object.keys(newItemsArray)
        );
        UICursor.set("ids", newIds);
        return newItems;
      } else {
        throw Error(response.statusText);
      }
    });
}

export default curry(loadIndex);
