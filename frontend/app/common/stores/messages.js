// IMPORTS =========================================================================================
let {List} = require("immutable");
let ReactRouter= require("react-router");
let Reflux = require("reflux");
let Actions = require("../actions");

// EXPORTS =========================================================================================
let Store = Reflux.createStore({
  listenables: [Actions],

  getInitialState() {
    return List();
  },

  // TODO: this should be at mixin level -----------------------------------------------------------
  init() {
    this.resetState();
  },

  resetState() {
    this.setState(this.getInitialState());
  },

  setState(state=undefined) {
    if (state) {
      this.state = state;
    }
    this.trigger(this.state);
  },
  //------------------------------------------------------------------------------------------------
});

export default Store;
