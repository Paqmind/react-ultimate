import {map} from "ramda";
import {toObject} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import api from "shared/api/alert";
import Model from "shared/models/alert";
import state from "frontend/state";
import ajax from "frontend/ajax";

// CURSORS =========================================================================================
let $alertQueue = state.select("alertQueue");

// ACTIONS =========================================================================================
// Filters, Sorts, Offset, Limit -> Maybe [Model]
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug(api.plural + ".fetchIndex(...)");

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return ajax.get(api.indexUrl, {params: query})
    .then(response => {
      if (response.status.startsWith("2")) {
        let newModels = map(m => Model(m), response.data.data);
        $alertQueue.concat(newModels);
        return newModels;
      } else {
        return [];
      }
    });
}
