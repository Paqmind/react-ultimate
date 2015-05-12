// IMPORTS =========================================================================================
import Axios from "axios";
import {toObject} from "shared/helpers/common";
import {formatQuery} from "shared/helpers/jsonapi";
import state from "frontend/state";
import commonActions from "frontend/actions";

// ACTIONS =========================================================================================
export default function fetchIndex() {
  console.debug("fetchIndex()");

  let cursor = state.select("robots");
  cursor.set("loading", true);
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");

  let url = `/api/robots/`;
  let query = formatQuery({filters, sorts, offset, limit});

  return Axios.get(url, {params: query})
    .then(response => {
      // Current state
      let models = cursor.get("models");
      let pagination = cursor.get("pagination");

      // New data
      let {data, meta} = response.data;
      let fetchedModels = toObject(data);

      // Update state
      cursor.merge({
        total: meta.page && meta.page.total || Object.keys(models).length,
        models: Object.assign(models, fetchedModels),
        pagination: Object.assign(pagination, {[offset]: Object.keys(fetchedModels)}),
        loading: false,
        loadError: false
      });
      state.commit();

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
        state.commit(); // God, this is required just about everywhere! :(
        commonActions.alert.add({message: "Action `Robot:fetchPage` failed: " + loadError.description, category: "error"});

        return response.status;
      }
    });
}