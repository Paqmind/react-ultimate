// IMPORTS =========================================================================================
let isObject = require("lodash.isobject");
let {Map} = require("immutable");
let Reflux = require("reflux");

// EXPORTS =========================================================================================
let AlertActions = Reflux.createActions({
  "loadMany": {asyncResult: true},
  "add": {},
  "remove": {},
});

export default AlertActions;
