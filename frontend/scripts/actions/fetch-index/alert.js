// IMPORTS =========================================================================================
import {keys, map, reduce, reduceIndexed} from "ramda";
import Axios from "axios";
import {toObject, mergeDeep} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import Alert from "shared/models/alert";
import state from "frontend/state";

// ACTIONS =========================================================================================
export default function fetchIndex(filters, sorts, offset, limit, models) {
  console.debug("fetchIndex(...)");
  let url = `/api/alerts/`;

  let cursor = state.select("alerts");
  cursor.set("loading", true);

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return Axios.get(url, {params: query})
    .then(response => {
      let {data, meta} = response.data;
      let newModelsArray = map(m => Alert(m), data);
      let newModelsObject = mergeDeep(models, toObject(newModelsArray));
      let newTotal = meta.page && meta.page.total || keys(models).length;

      cursor.merge({
        total: newTotal,
        models: newModelsObject,
        loading: false,
        loadError: false
      });

      return response.status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let loadError = {
          status: response.status,
          description: response.statusText,
          url: url
        };
        cursor.merge({loading: false, loadError});

        return response.status;
      }
    });
}
