// IMPORTS =========================================================================================
let UUID = require('node-uuid');
let {List, Map, OrderedMap} = require("immutable");
let ReactRouter= require("react-router");
let AlertActions = require("frontend/alert/actions");

// EXPORTS =========================================================================================
/*
let AlertStore = Reflux.createStore({
  listenables: [AlertActions],

  getInitialState() {
    return OrderedMap();
  },

  // TODO: this should be at mixin level -----------------------------------------------------------
  init() {
    this.resetState();
  },

  resetState() {
    this.setState(this.getInitialState());
  },

  setState(state) {
    if (state === undefined) {
      throw Error("`state` is required");
    } else {
      this.state = state;
      this.shareState();
    }
  },

  shareState() {
    this.trigger(this.state);
  },
  //------------------------------------------------------------------------------------------------
  normalize(message, category) {
    if (isString(model)) {
      model = {
        message: model,
        category
      }
    }
    return Object.assign({}, model, {id: UUID.v4()});
  },

  add(model) {
    model = model.merge({id: UUID.v4()});
    this.setState(this.state.set(model.id, model));
  },

  remove(index) {
    if (index === undefined || index === null) {
      throw Error("`index` is required");
    } else {
      this.setState(this.state.delete(index));
    }
  },

  pop() {
    this.setState(this.state.pop());
  }
});

export default AlertStore;
*/
