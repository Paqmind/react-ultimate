// IMPORTS =========================================================================================
let Axios = require("axios");
let {toObject} = require("frontend/common/helpers");
let Router = require("frontend/router");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function loadMany() {
  State.select("alerts").edit({loaded: true, loadError: undefined, models: {}});
  return {};
  // TODO: backend
  //return Axios.get(`/api/alerts/`)
  //  .then(response => {
  //    let models = toObject(response.data);
  //    State.select("alerts").edit({loaded: true, loadError: undefined, models: models});
  //    State.select("alerts").edit({loaded: true, loadError: undefined, models: models});
  //    return models;
  //  })
  //  .catch(response => {
  //    if (response instanceof Error) {
  //      throw response;
  //    } else {
  //      let loadError = response.status.toString();
  //      State.select("alerts").set("loaded", true);
  //      State.select("alerts").set("loadError", loadError);
  //      return loadError;
  //    }
  //  });
}