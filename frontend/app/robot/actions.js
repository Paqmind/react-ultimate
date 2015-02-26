// IMPORTS =========================================================================================
let Reflux = require("reflux");
let Router = require("frontend/router");
let Alert = require("frontend/alert/models");
let AlertActions = require("frontend/alert/actions");

// EXPORTS =========================================================================================
let RobotActions = Reflux.createActions({
  "loadMany": {asyncResult: true},
  "loadOne": {asyncResult: true},
  "add": {asyncResult: true},
  "edit": {asyncResult: true},
  "remove": {asyncResult: true},
});

RobotActions.add.completed.preEmit = function(res) {
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
