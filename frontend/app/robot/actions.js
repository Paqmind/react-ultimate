// IMPORTS =========================================================================================
let {Map} = require("immutable");
let Axios = require("axios");
let Reflux = require("reflux");
let Router = require("../router");

// EXPORTS =========================================================================================
let Actions = Reflux.createActions({
  "loadMany": {asyncResult: true},
  "loadOne": {asyncResult: true},
  "add": {asyncResult: true},
  "edit": {asyncResult: true},
  "remove": {asyncResult: true},
});

Actions.add.completed.preEmit = function(res) {
  // We also can redirect to `/{res.data.id}/edit`
  Router.transitionTo("robot-index"); // or use link = router.makePath("robot-index", params, query), concat anchor, this.transitionTo(link)
};

Actions.remove.completed.preEmit = function(res) {
  // We also can redirect to `/{res.data.id}/edit`
  Router.transitionTo("robot-index"); // or use link = router.makePath("robot-index", params, query), concat anchor, this.transitionTo(link)
};

export default Actions;
