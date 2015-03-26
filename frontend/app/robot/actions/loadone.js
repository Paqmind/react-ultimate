// IMPORTS =========================================================================================
let Axios = require("axios");
let {toObject} = require("frontend/common/helpers");
let Router = require("frontend/router");
let Alert = require("frontend/alert/models");
let addAlert = require("frontend/alert/actions/add");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function loadOne() {
  // TODO
  //return Axios.get(`/api/robots/`)
  //  .then(response => {
  //    let models = toObject(response.data);
  //    State.select("robots").edit({loaded: true, loadError: undefined, models: models});
  //    State.select("robots").edit({loaded: true, loadError: undefined, models: models});
  //    return models;
  //  })
  //  .catch(response => {
  //    if (response instanceof Error) {
  //      throw response;
  //    } else {
  //      let loadError = response.status.toString();
  //      State.select("robots").set("loaded", true);
  //      State.select("robots").set("loadError", loadError);
  //      return loadError;
  //    }
  //  });
}