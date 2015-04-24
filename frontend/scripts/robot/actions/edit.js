// IMPORTS =========================================================================================
let Axios = require("axios");

let router = require("frontend/common/router");
let commonActions = require("frontend/common/actions");
let Robot = require("frontend/robot/models");
let state = require("frontend/state");

// ACTIONS =========================================================================================
export default function edit(model) {
  let newModel = Robot(model);
  let id = newModel.id;
  let oldModel = state.select("robots", "models", id).get();
  let apiURL = `/api/robots/${id}`;

  // Optimistic edit
  state.select("robots", "loading").set(true);
  state.select("robots", "models", id).set(newModel);

  return Axios.put(apiURL, newModel)
    .then(response => {
      state.select("robots").merge({
        loading: false,
        loadError: undefined,
      });
      commonActions.alert.add({message: "Action `Robot.edit` succeed", category: "success"});
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
        state.select("robots", "models", id).set(oldModel); // Cancel edit
        commonActions.alert.add({message: "Action `Robot.edit` failed: " + loadError.description, category: "error"});
        return response.status
      }
    })
    .done();

  /* Async-Await style. Wait for proper IDE support
  // Optimistic edit
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
