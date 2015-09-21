import {map, reduceIndexed} from "ramda";
import {toObject} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import api from "shared/api/monster";
import Item from "shared/types/monster";
import state from "frontend/state";
import ajax from "frontend/ajax";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $items = $data.select("items");

// ACTIONS =========================================================================================
// Filters, Sorts, Offset, Limit -> Maybe [Item]
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug(api.plural + `.fetchIndex(...)`);

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return ajax.get(api.indexUrl, {params: query})
    .then(response => {
      if (response.status.startsWith("2")) {
        let newItemsArray = map(m => Item(m), response.data.data);
        let newItems = toObject(newItemsArray);
        $items.merge(newItems);
        $data.set("total", response.data.meta.page.total);
        $data.apply("pagination", pp => {
          return reduceIndexed((memo, m, i) => {
              memo[offset + i] = m.id;
              return memo;
            }, pp, newItemsArray
          );
        });
        return newItems;
      } else {
        return [];
      }
    });
}
