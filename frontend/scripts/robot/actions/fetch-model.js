// IMPORTS =========================================================================================
import Axios from "axios";

import {toObject} from "shared/common/helpers";
import state from "frontend/common/state";
import commonActions from "frontend/common/actions";

// ACTIONS =========================================================================================
export default function fetchModel(id) {
  console.debug("fetchModel:", id);

  let url = `/api/robots/${id}`;
  let cursor = state.select("robots");

  cursor.set("loading", true);
  return Axios.get(url)
    .then(response => {
      let {data, meta} = response.data;
      let model = data;

      // BUG, NOT WORKING ==========================================================================
      // TRACK: https://github.com/Yomguithereal/baobab/issues/190
      //        https://github.com/Yomguithereal/baobab/issues/194
      //cursor.merge({
      //  loading: false,
      //  loadError: undefined,
      //});
      //cursor.select("models").set(model.id, model);
      // ===========================================================================================
      // WORKAROUND:
      cursor.apply(robots => {
        let models = Object.assign({}, robots.models);
        models[model.id] = model;
        return Object.assign({}, robots, {
          loading: false,
          loadError: undefined,
          models: models,
        });
      });
      state.commit();
      // ===========================================================================================

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
        commonActions.alert.add({message: "Action `Robot:fetchModel` failed: " + loadError.description, category: "error"});

        return response.status;
      }
    })
    .done();
}