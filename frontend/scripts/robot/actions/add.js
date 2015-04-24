// IMPORTS =========================================================================================
let Axios = require("axios");

let router = require("frontend/common/router");
let commonActions = require("frontend/common/actions");
let Robot = require("frontend/robot/models");
let state = require("frontend/state");

// ACTIONS =========================================================================================
export default function add(model) {
  let newModel = Robot(model);
  let id = newModel.id;
  let apiURL = `/api/robots/${id}`;

  // Optimistic add
  state.select("robots", "loading").set(true);
  state.select("robots", "models", id).set(newModel);

  return Axios.put(apiURL, newModel)
    .then(response => {
      state.select("robots").merge({loading: false, loadError: undefined});
      commonActions.alert.add({message: "Action `Robot.add` succeed", category: "success"});
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
        state.select("robots", "models").unset(id); // Cancel add
        commonActions.alert.add({message: "Action `Robot.add` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    })
    .done();

  /* Async-Await style. Wait for proper IDE support
  // Optimistic add
  ...

  let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    ...
  } // else
    ...
  */
}
