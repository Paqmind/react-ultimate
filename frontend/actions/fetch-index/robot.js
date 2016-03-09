import {addIndex, insert, map, reduce} from "ramda";
import {toObject} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import api from "shared/api/robot";
import {Robot} from "shared/types";
import {parseAs} from "shared/parsers";
import state from "frontend/state";
import ajax from "frontend/ajax";

let reduceIndexed = addIndex(reduce);
let dataCursor = state.select(api.plural);
let itemsCursor = dataCursor.select("items");

// Filters, Sorts, Offset, Limit -> Promise [Robot]
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug(api.plural + `.fetchIndex(...)`);

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return ajax.get(api.indexUrl, {params: query})
    .then(response => {
      if (response.status.startsWith("2")) {
        let newItemsArray = map(data => parseAs(Robot, data), response.data.data);
        let newItems = toObject(newItemsArray);
        itemsCursor.merge(newItems);
        dataCursor.apply("pagination", ps => {
          return reduceIndexed((memo, m, i) => {
              return insert(offset + i, m.id, memo);
            }, ps, newItemsArray
          );
        });
        return newItems;
      } else {
        return [];
      }
    });
}
