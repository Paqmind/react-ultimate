// IMPORTS =========================================================================================
let Axios = require("axios");

let {toObject} = require("frontend/common/helpers");
let CommonActions = require("frontend/common/actions");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export function fetchOne(id) {
  let apiURL = `/api/robots/${id}`;

  State.select("robots").set("loading", true);
  return Axios.get(apiURL)
    .then(response => {
      let {data, meta} = response.data;
      let model = data;
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", undefined);
      State.select("robots", "models").set(model.id, model);
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
        State.select("robots").set("loading", false);
        State.select("robots").set("loadError", loadError);
        CommonActions.addAlert({message: "Action `Robot:fetchOne` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    });
}

export default function loadOne(id) {
  // TODO read from cache here
  return fetchOne(id);
}