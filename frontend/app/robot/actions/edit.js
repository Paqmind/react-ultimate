// IMPORTS =========================================================================================
let Axios = require("axios");
let Router = require("frontend/router");
let addAlert = require("frontend/alert/actions/add");
let State = require("frontend/state");
let Robot = require("frontend/robot/models");

// ACTIONS =========================================================================================
export default function edit(model) {
  let newModel = Robot(model);
  let id = newModel.id;
  let oldModel = State.select("robots", "models", id);

  // Optimistic edit
  State.select("robots", "models").set(id, newModel);

  return Axios.put(`/api/robots/${id}`, newModel)
    .then(response => {
      let status = response.status.toString();
      State.select("robots").set("loaded", true);
      State.select("robots").set("loadError", undefined);
      addAlert({message: "Robot edited.", category: "success"});
      return status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let status = response.status.toString();
        State.select("robots").set("loaded", true);
        State.select("robots").set("loadError", status);
        State.select("robots", "models").set(id, oldModel); // Cancel edit
        return status;
      }
    });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic edit
  State.select("robots", "models").set(id, newModel);

  let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").set(id, oldModel); // Cancel edit
    return status;
  } // else
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    return status;
  */
}
