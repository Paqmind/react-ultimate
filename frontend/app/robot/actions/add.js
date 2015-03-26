// IMPORTS =========================================================================================
let Axios = require("axios");
let Router = require("frontend/router");
let addAlert = require("frontend/alert/actions/add");
let State = require("frontend/state");
let Robot = require("frontend/robot/models");

// ACTIONS =========================================================================================
export default function add(model) {
  let newModel = Robot(model);
  let id = newModel.id;

  // Optimistic add
  State.select("robots", "models").set(id, newModel);

  return Axios.put(`/api/robots/${id}`, newModel)
    .then(response => {
      let status = response.status.toString();
      State.select("robots").set("loaded", true);
      State.select("robots").set("loadError", undefined);
      addAlert({message: "Robot added.", category: "success"});
      return status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let status = response.status.toString();
        State.select("robots").set("loaded", true);
        State.select("robots").set("loadError", status);
        State.select("robots", "models").unset(id); // Cancel add
        return status;
      }
    });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic add
  State.select("robots", "models").set(id, newModel);

  let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").unset(id); // Cancel add
    return status;
  } // else
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    return status;
  */
}
