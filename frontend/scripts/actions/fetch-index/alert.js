// IMPORTS =========================================================================================
import {map} from "ramda";
import Axios from "axios";
import {toObject, mergeDeep} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import Alert from "shared/models/alert";
import state from "frontend/state";

// CURSORS =========================================================================================
let modelCursor = state.select("alerts");

// ACTIONS =========================================================================================
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug("fetchIndex(...)");

  modelCursor.set("loading", true);

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return Axios.get(`/api/alerts/`, {params: query})
    .then(response => {
      let {data, meta} = response.data;
      let newModels = map(m => Alert(m), data);

      modelCursor.select("models").merge(toObject(newModels));
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

        return response.status;
      }
    });
}
