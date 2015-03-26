// IMPORTS =========================================================================================
let Axios = require("axios");
let Router = require("frontend/router");
let Alert = require("frontend/alert/models");
let addAlert = require("frontend/alert/actions/add");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function remove(id) {
  let oldModel = State.select("robots", "models", id);

  // Optimistic remove
  State.select("robots", "models").unset(id);

  return Axios.delete(`/api/robots/${id}`)
    .then(response => {
      let status = response.status.toString();
      State.select("robots").set("loaded", true);
      State.select("robots").set("loadError", undefined);
      Router.transitionTo("robot-index");
      addAlert(Alert({message: "Robot removed.", category: "success"}));
      return status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let status = response.status.toString();
        State.select("robots").set("loaded", true);
        State.select("robots").set("loadError", status);
        State.select("robots", "models").set(id, oldModel); // Cancel remove
        return status;
      }
    });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic remove
  State.select("robots", "models").unset(id);

  let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").set(id, oldModel); // Cancel remove
    return status;
  } // else
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    return status;
  */
}
