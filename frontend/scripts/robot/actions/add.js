// IMPORTS =========================================================================================
let Axios = require("axios");

let Router = require("frontend/common/router");
let State = require("frontend/common/state");
let addAlert = require("frontend/alert/actions/add");
let Robot = require("frontend/robot/models");

// ACTIONS =========================================================================================
export default function add(model) {
  let newModel = Robot(model);
  let id = newModel.id;
  let apiURL = `/api/robots/${id}`;

  // Optimistic add
  State.select("robots").set("loading", true);
  State.select("robots", "models").set(id, newModel);

  return Axios.put(apiURL, newModel)
    .then(response => {
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", undefined);
      addAlert({message: "Action `Robot.add` succeed", category: "success"});
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
        State.select("robots", "models").unset(id); // Cancel add
        addAlert({message: "Action `Robot.add` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic add
  ...

  let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").unset(id); // Cancel add
    return status;
  } // else
    let status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    addAlert({message: "Action `Robot.edit` failed", category: "error"});
    return status;
  */
}
