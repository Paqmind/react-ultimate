import {map, reduceIndexed} from "ramda";
import {toObject} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import api from "shared/api/robot";
import Model from "shared/models/robot";
import state from "frontend/state";
import ajax from "frontend/ajax";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $models = $data.select("models");

// ACTIONS =========================================================================================
// Filters, Sorts, Offset, Limit -> Maybe [Model]
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug(api.plural + `.fetchIndex(...)`);

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return ajax.get(api.indexUrl, {params: query})
    .then(response => {
      if (response.status.startsWith("2")) {
        let newModelsArray = map(m => Model(m), response.data.data);
        let newModels = toObject(newModelsArray);
        $models.merge(newModels);
        $data.set("total", response.data.meta.page.total);
        $data.apply("pagination", pp => {
          return reduceIndexed((memo, m, i) => {
              memo[offset + i] = m.id;
              return memo;
            }, pp, newModelsArray
          );
        });
        return newModels;
      } else {
        return [];
      }
    });
}
