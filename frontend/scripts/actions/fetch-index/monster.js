// IMPORTS =========================================================================================
import {keys, map, merge, reduce, reduceIndexed} from "ramda";
import Axios from "axios";
import {toObject} from "shared/helpers/common";
import {formatQuery} from "shared/helpers/jsonapi";
import Monster from "shared/models/monster";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// ACTIONS =========================================================================================
export default function fetchIndex() {
  console.debug("fetchIndex()");

  let cursor = state.select("monsters");
  cursor.set("loading", true);
  let models = cursor.get("models");
  let pagination = cursor.get("pagination");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");

  let url = `/api/monsters/`;
  let query = formatQuery({filters, sorts, offset, limit});

  return Axios.get(url, {params: query})
    .then(response => {
      let {data, meta} = response.data;
      let newModelsArray = map(m => Monster(m), data);
      let newModelsObject = merge(models, toObject(newModelsArray));
      let newTotal = meta.page && meta.page.total || keys(models).length;

      let newPagination = reduceIndexed((pagination, model, i) => {
        pagination[offset + i] = model.id;
        return pagination;
      }, pagination, newModelsArray);

      cursor.merge({
        total: newTotal,
        models: newModelsObject,
        pagination: newPagination,
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

        alertActions.add({message: "Action `Monster:fetchPage` failed: " + loadError.description, category: "error"});

        return response.status;
      }
    });
}