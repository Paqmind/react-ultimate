// IMPORTS =========================================================================================
let Axios = require("axios");
let Reflux = require("reflux");

// EXPORTS =========================================================================================
let Actions = Reflux.createActions({
  "loadMany": {asyncResult: true},
  "loadOne": {asyncResult: true},
  "add": {asyncResult: true},
  "edit": {asyncResult: true},
  "remove": {asyncResult: true},
});

export default Actions;
