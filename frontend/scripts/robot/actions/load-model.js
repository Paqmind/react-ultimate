// IMPORTS =========================================================================================
let Axios = require("axios");

let {toObject} = require("frontend/common/helpers");
let commonActions = require("frontend/common/actions");
let state = require("frontend/state");

// ACTIONS =========================================================================================
export function fetchModel(id) {
  let apiURL = `/api/robots/${id}`;

  state.select("robots", "loading").set(true);
  return Axios.get(apiURL)
    .then(response => {
      let {data, meta} = response.data;
      let model = data;

      // BUG, NOT WORKING ==========================================================================
      // TRACK: https://github.com/Yomguithereal/baobab/issues/190
      //        https://github.com/Yomguithereal/baobab/issues/194
      //state.select("robots").merge({
      //  loading: false,
      //  loadError: undefined,
      //});
      //state.select("robots", "models", model.id).set(model);
      // ===========================================================================================
      // WORKAROUND:
      state.select("robots").apply(robots => {
        let models = Object.assign({}, robots.models);
        models[model.id] = model;
        return Object.assign({}, robots, {
          loading: false,
          loadError: undefined,
          models: models,
        });
      });
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
          url: apiURL
        };
        state.select("robots").merge({loading: false, loadError});
        commonActions.alert.add({message: "Action `Robot:fetchModel` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    })
    .done();
}

export default function loadModel(id) {
  let model = state.select("robots", "models").get(id);
  if (model) {
    return model;
  } else {
    return fetchModel(id);
  }
}