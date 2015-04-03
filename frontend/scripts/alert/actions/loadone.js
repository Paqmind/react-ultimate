// IMPORTS =========================================================================================
let Axios = require("axios");
let {toObject} = require("frontend/common/helpers");
let Router = require("frontend/router");
let Alert = require("frontend/alert/models");
let addAlert = require("frontend/alert/actions/add");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function loadOne() {
  let apiURL = `/api/alerts/`;

  // TODO
  //return Axios.get(apiURL)
  //  .then(response => {
  //    let models = toObject(response.data);
  //    State.select("robots").edit({loading: false, loadError: undefined, models: models});
  //    return models;
  //  })
  //  .catch(response => {
  //    if (response instanceof Error) {
  //      throw response;
  //    } else {
  //      let loadError = {status: response.statusText, url: apiURL};
  //      State.select("robots").set("loading", false);
  //      State.select("robots").set("loadError", loadError);
  //      addAlert({message: "Action `Alert.loadOne` failed", category: "error"});
  //      return loadError;
  //    }
  //  });
}
