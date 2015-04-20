// IMPORTS =========================================================================================
let Axios = require("axios");

let {toObject} = require("frontend/common/helpers");
let Router = require("frontend/common/router");
let State = require("frontend/common/state");
let Alert = require("frontend/alert/models");
let addAlert = require("frontend/alert/actions/add");

// ACTIONS =========================================================================================
export default function loadOne() {
  let apiURL = `/api/robots/`;

  // TODO
  //return Axios.get(apiURL)
  //  .then(response => {
  //    let models = toObject(response.data);
  //    State.select("robots").edit({
  //      loading: false,
  //      loadError: undefined,
  //      models: models,
  //      total: ???
  // });
  //    return response.status;
  //  })
  //  .catch(response => {
  //    if (response instanceof Error) {
  //      throw response;
  //    } else {
  //      let loadError = {
  //        status: response.status,
  //        description: response.statusText,
  //        url: apiURL
  //      };
  //      State.select("robots").set("loading", false);
  //      State.select("robots").set("loadError", loadError);
  //      addAlert({message: "Action `Robot.loadOne` failed: " + loadError.description, category: "error"});
  //      return response.status;
  //    }
  //  });
}
