import {addIndex, insert, map, reduce} from "ramda";
import {toObject} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import api from "shared/api/robot";
import {Robot} from "shared/types/robot";
import {parseAs} from "shared/parsers";
import state from "frontend/state";
import ajax from "frontend/ajax";

let reduceIndexed = addIndex(reduce);
let data$ = state.select(api.plural);
let items$ = data$.select("items");

// Filters, Sorts, Offset, Limit -> Maybe [Robot]
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug(api.plural + `.fetchIndex(...)`);

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return ajax.get(api.indexUrl, {params: query})
    .then(response => {
      if (response.status.startsWith("2")) {
        let newItemsArray = map(data => parseAs(data, Robot), response.data.data);
        let newItems = toObject(newItemsArray);
        items$.merge(newItems);
        data$.set("total", response.data.meta.page.total);
        data$.apply("pagination", pp => {
          return reduceIndexed((memo, m, i) => {
              return insert(offset + i, m.id, memo);
            }, pp, newItemsArray
          );
        });
        return newItems;
      } else {
        return [];
      }
    });
}
