// IMPORTS =========================================================================================
import {keys, map, reduce, reduceIndexed} from "ramda";
import Axios from "axios";
import {toObject, mergeDeep} from "shared/helpers/common";
import {formatQueryForAxios} from "shared/helpers/jsonapi";
import Robot from "shared/models/robot";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// ACTIONS =========================================================================================
export default function fetchIndex(filters, sorts, offset, limit, models, pagination) {
  console.debug("fetchIndex(...)");
  let url = `/api/robots/`;

  let cursor = state.select("robots");
  cursor.set("loading", true);

  let query = formatQueryForAxios({filters, sorts, offset, limit});

  return Axios.get(url, {params: query})
    .then(response => {
      let {data, meta} = response.data;
      let newModelsArray = map(m => Robot(m), data);
      let newModelsObject = mergeDeep(models, toObject(newModelsArray));
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

        alertActions.addModel({message: "Action `Robot:fetchPage` failed: " + loadError.description, category: "error"});

        return response.status;
      }
    });
}