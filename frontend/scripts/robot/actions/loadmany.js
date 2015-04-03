// IMPORTS =========================================================================================
let Axios = require("axios");
let {toObject} = require("frontend/common/helpers");
let Router = require("frontend/router");
let addAlert = require("frontend/alert/actions/add");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function loadMany() {
  let apiURL = `/api/robots/`;

  State.select("robots").set("loading", true);
  return Axios.get(apiURL)
    .then(response => {
      let models = toObject(response.data);
      State.select("robots").edit({loading: false, loadError: undefined, models: models});
      State.select("robots").edit({loading: false, loadError: undefined, models: models});
      return models; // TODO: why here models are returning, and in add/edit status?
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
        State.select("robots").set("loading", false);
        State.select("robots").set("loadError", loadError);
        addAlert({message: "Action `Robot.loadMany` failed: " + loadError.description, category: "error"});
        return loadError.description;
      }
    });
}
