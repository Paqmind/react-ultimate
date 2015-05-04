// IMPORTS =========================================================================================
import Axios from "axios";
import {toObject} from "shared/helpers/common";
import state from "frontend/state";
import commonActions from "frontend/actions";

// ACTIONS =========================================================================================
export default function fetchModel(id) {
  console.debug("fetchModel:", id);

  let url = `/api/monsters/${id}`;
  let cursor = state.select("monsters");

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
      cursor.apply(monsters => {
        let models = Object.assign({}, monsters.models);
        models[model.id] = model;
        return Object.assign({}, monsters, {
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
        commonActions.alert.add({message: "Action `Monster:fetchModel` failed: " + loadError.description, category: "error"});

        return response.status;
      }
    })
    .done();
}