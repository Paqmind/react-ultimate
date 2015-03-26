// IMPORTS =========================================================================================
let Axios = require("axios");
let Router = require("frontend/router");
let addAlert = require("frontend/alert/actions/add");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function remove(id) {
  let oldModel = State.select("robots", "models", id);
  let apiURL = `/api/robots/${id}`;

  // Optimistic remove
  State.select("robots").set("loading", true);
  State.select("robots", "models").unset(id);

  return Axios.delete(apiURL)
    .then(response => {
      let status = response.statusText;
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", undefined);
      Router.transitionTo("robot-index");
      addAlert({message: "Action `Robot.remove` succeed", category: "success"});
      return status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let status = response.statusText;
        State.select("robots").set("loading", false);
        State.select("robots").set("loadError", status);
        State.select("robots", "models").set(id, oldModel); // Cancel remove
        addAlert({message: "Action `Robot.remove` failed", category: "error"});
        return status;
      }
    });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic remove
  ...

  let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").set(id, oldModel); // Cancel remove
    return status;
  } // else
    let status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    return status;
  */
}
