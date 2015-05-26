// IMPORTS =========================================================================================
import {map, reduceIndexed} from "ramda";
import Axios from "axios";
import {toObject, mergeDeep} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import Robot from "shared/models/robot";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// CURSORS =========================================================================================
let modelCursor = state.select("robots");

// ACTIONS =========================================================================================
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug("fetchIndex(...)");

  let url = `/api/robots/`;

  modelCursor.set("loading", true);

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return Axios.get(url, {params: query})
    .then(response => {
      let {data, meta} = response.data;
      let newModels = map(m => Robot(m), data);

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
            url: url
          }
        });

        // Add alert
        alertActions.addModel({message: "Action `Robot:fetchPage` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    });
}
