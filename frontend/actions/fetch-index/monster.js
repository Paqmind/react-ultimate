import {map, reduceIndexed} from "ramda";
import Axios from "axios";
import {toObject} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import Monster from "shared/models/monster";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// CURSORS =========================================================================================
let modelCursor = state.select("monsters");

// ACTIONS =========================================================================================
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug("fetchIndex(...)");

  let url = `/api/monsters/`;

  modelCursor.set("loading", true);

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return Axios.get(url, {params: query})
    .then(response => {
      let {data, meta} = response.data;
      let newModels = map(m => Monster(m), data);

      modelCursor.select("models").merge(toObject(newModels));
      modelCursor.select("pagination").apply(pagination => {
        return reduceIndexed((memo, m, i) => {
            memo[offset + i] = m.id;
            return memo;
          }, pagination, newModels
        );
      });
      modelCursor.merge({
        total: meta.page.total,
        loading: false,
        loadError: false
      });

      return response.status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        modelCursor.merge({
          loading: false,
          loadError: {
            status: response.status,
            description: response.statusText,
            url
          }
        });

        // Add alert
        alertActions.addModel({message: "Action `Monster:fetchIndex` failed: " + response.statusText, category: "error"});
        return response.status;
      }
    });
}
