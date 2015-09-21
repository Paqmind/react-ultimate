import {map} from "ramda";
import {toObject} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import api from "shared/api/alert";
import Alert from "shared/types/alert";
import state from "frontend/state";
import ajax from "frontend/ajax";

// CURSORS =========================================================================================
let $alertQueue = state.select("alertQueue");

// ACTIONS =========================================================================================
// Filters, Sorts, Offset, Limit -> Maybe [Item]
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug(api.plural + ".fetchIndex(...)");

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return ajax.get(api.indexUrl, {params: query})
    .then(response => {
      if (response.status.startsWith("2")) {
        let newItems = map(m => Alert(m), response.data.data);
        $alertQueue.concat(newItems);
        return newItems;
      } else {
        return [];
      }
    });
}
