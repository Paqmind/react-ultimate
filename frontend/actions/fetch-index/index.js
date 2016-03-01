import {map, range, reduce, update} from "ramda";
import {toObject} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import {parseAs} from "shared/parsers";
import state from "frontend/state";
import ajax from "frontend/ajax";

// Cursor, Cursor, Type, api -> Promise
export default function fetchIndex(DBCursor, UICursor, Type, api) {
  console.debug(api.plural + `.fetchIndex(...)`);

  let {ids, filters, sorts, offset, limit} = UICursor.get();
  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return ajax.get(api.indexUrl, {params: query})
    .then(response => {
      if (response.status.startsWith("2")) {
        let newItemsArray = map(t => parseAs(Type, t), response.data.data);
        let newItems = toObject(newItemsArray);
        DBCursor.merge(newItems);

        let newTotal = response.data.meta.page.total;
        UICursor.set("total", newTotal);

        let newIds = ids;
        if (newIds.length != newTotal) {
          newIds = range(0, newTotal).map(() => null); // init ids with empty values
        }
        newIds = reduce((memo, i) => {
            return update(offset + parseInt(i), newItemsArray[i].id, memo);
          }, newIds, Object.keys(newItemsArray)
        );
        UICursor.set("ids", newIds);
      }
    });
}
