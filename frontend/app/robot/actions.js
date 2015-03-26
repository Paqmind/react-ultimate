// IMPORTS =========================================================================================
let Axios = require("axios");
let {toObject} = require("frontend/common/helpers");
let Router = require("frontend/router");
let Alert = require("frontend/alert/models");
let AlertActions = require("frontend/alert/actions");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export function loadMany() {
  return Axios.get(`/api/robots/`)
    .then(response => {
      let models = toObject(response.data);
      State.select("robots").edit({loaded: true, loadError: undefined, models: models});
      State.select("robots").edit({loaded: true, loadError: undefined, models: models});
      return models;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let loadError = response.status.toString();
        State.select("robots").set("loaded", true);
        State.select("robots").set("loadError", loadError);
        return loadError;
      }
    });
}

export function loadOne() {

}

export function edit(nextModel) {
  let id = nextModel.id;
  let prevModel = State.select("robots", "models", id);

  // Optimistic update
  State.select("robots", "models", id).edit(nextModel);

  return Axios.put(`/api/robots/${id}`, nextModel)
    .then(response => {
      let status = response.status.toString();
      State.select("robots").set("loaded", true);
      State.select("robots").set("loadError", undefined);
      return status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let status = response.status.toString();
        State.select("robots").set("loaded", true);
        State.select("robots").set("loadError", status);
        State.select("robots", "models", id).edit(prevModel); // Cancel update
        return status;
      }
    });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic update
  State.select("robots", "models", id).edit(nextModel);

  let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, nextModel);
  } catch (response) {
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", status);
    State.select("robots", "models", id).edit(prevModel); // Cancel update
    return status;
  } // else
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    return status;
  */
}

export function remove(id) {
  let prevModel = State.select("robots", "models", id);

  // Optimistic remove
  State.select("robots", "models").unset(id);

  return Axios.delete(`/api/robots/${id}`)
    .then(response => {
      let status = response.status.toString();
      State.select("robots").set("loaded", true);
      State.select("robots").set("loadError", undefined);
      Router.transitionTo("robot-index");
      return status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let status = response.status.toString();
        State.select("robots").set("loaded", true);
        State.select("robots").set("loadError", status);
        State.select("robots", "models").set(id, prevModel); // Cancel remove
        return status;
      }
    });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic remove
  State.select("robots", "models").unset(id);

  let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, nextModel);
  } catch (response) {
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").set(id, prevModel); // Cancel remove
    return status;
  } // else
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    return status;
  */
}

//export default {
  //async loadMany() {
  //  let response = await Axios.get(`/api/robots/`);
  //  return Map([for (model of response.data) [model.id, Map(model)]]);
  //}
  //
  //async loadOne(id) {
  //  let response = await Axios.get(`/api/robotz/${id}`);
  //  return Map(response.data);
  //}
  //
  //async remove(id) {
  //  let response = await Axios.delete(`/api/robotz/${id}`, {id});
  //  return id;
  //}

//  loadOne() {
//    console.log("RobotActions:loadOne!");
//  },
//
//  add() {
//    console.log("RobotActions:add!");
//  },
//
//  remove() {
//    console.log("RobotActions:remove!");
//  }
//};

//let RobotActions = Reflux.createActions({
//  "loadMany": {asyncResult: true},
//  "loadOne": {asyncResult: true},
//  "add": {asyncResult: true},
//  "edit": {asyncResult: true},
//  "remove": {asyncResult: true},
//});

/*RobotActions.add.completed.preEmit = function(res) {
  // We also can redirect to `/{res.data.id}/edit`
  AlertActions.add(Alert({message: "Robot added!", category: "success"}));
  Router.transitionTo("robot-index"); // or use link = router.makePath("robot-index", params, query), concat anchor, this.transitionTo(link)
};

RobotActions.add.failed.preEmit = function(res) {
  AlertActions.add(Alert({message: "Failed to add Robot!", category: "error"}));
};

RobotActions.remove.completed.preEmit = function(res) {
  AlertActions.add(Alert({message: "Robot removed!", category: "success"}));
  Router.transitionTo("robot-index");
};

RobotActions.remove.failed.preEmit = function(res) {
  AlertActions.add(Alert({message: "Failed to remove Robot!", category: "error"}));
};

export default RobotActions;
*/

// TODO localStorage?!