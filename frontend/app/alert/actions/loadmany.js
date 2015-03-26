// IMPORTS =========================================================================================
let Axios = require("axios");
let {toObject} = require("frontend/common/helpers");
let Router = require("frontend/router");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function loadMany() {
  let apiURL = `api/alerts`;

  State.select("alerts").edit({loading: false, loadError: undefined, models: {}});
  return {};
  // TODO: backend
  //return Axios.get(apiURL)
  //  .then(response => {
  //    let models = toObject(response.data);
  //    State.select("alerts").edit({loading: false, loadError: undefined, models: models});
  //    State.select("alerts").edit({loading: false, loadError: undefined, models: models});
  //    return models;
  //  })
  //  .catch(response => {
  //    if (response instanceof Error) {
  //      throw response;
  //    } else {
  //      let loadError = {status: response.statusText, url: apiURL};
  //      State.select("alerts").set("loading", false);
  //      State.select("alerts").set("loadError", loadError);
  //      addAlert({message: "Action `Alert.loadMany` failed", category: "error"});
  //      return loadError;
  //    }
  //  });
}