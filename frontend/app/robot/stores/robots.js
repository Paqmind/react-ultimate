// IMPORTS =========================================================================================
let {List, Map, OrderedMap} = require("immutable");
let ReactRouter= require("react-router");
let Axios = require("axios");
let Reflux = require("reflux");
let Actions = require("frontend/robot/actions");

// EXPORTS =========================================================================================
let Store = Reflux.createStore({
  // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
  listenables: [Actions],

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

  setState(state=undefined) {
    if (state) {
      this.state = state;
    }
    this.trigger(this.state);
  },
  //------------------------------------------------------------------------------------------------

  loadMany() {
    this.stopListeningTo(Actions.loadMany);
    // TODO check local storage
    if (this.indexLoaded) {
      this.setState();
    } else {
      Actions.loadMany.promise(Axios.get('/api/robots/'));
    }
  },

  loadManyFailed(res) {
    console.log("RobotStore.loadManyFailed", res);
    this.resetState();
    this.listenTo(Actions.loadMany, this.loadMany);
  },

  loadManyCompleted(res) {
    console.log("RobotStore.loadManyCompleted", res);
    let models = List(res.data);
    this.setState(OrderedMap([for (model of models) [model.id, Map(model)]]));
    this.indexLoaded = true;
    this.listenTo(Actions.loadMany, this.loadMany);
  },

  loadOne(id) {
    // TODO check local storage?!
    this.stopListeningTo(Actions.loadOne);
    if (this.state.has(id)) {
      this.setState();
    } else {
      // TODO check local storage?!
      Axios.get(`/api/robots/${id}`)
        .catch(res => Actions.loadOne.failed(res, id))
        .then(res => Actions.loadOne.completed(res, id));
    }
  },

  loadOneFailed(res, id) {
    console.log("RobotStore.loadManyFailed", res, id);
    this.setState(this.state.set(id, "Not Found"));
    this.listenTo(Actions.loadOne, this.loadOne);
  },

  loadOneCompleted(res, id) {
    console.log("RobotStore.loadOneCompleted", id);
    let model = Map(res.data);
    this.setState(this.state.set(id, model));
    this.listenTo(Actions.loadOne, this.loadOne);
  },

  add(model) {
    Actions.add.promise(Axios.post(`/api/robots/`, model.toJS()));
  },

  addFailed(res) {
    console.debug("RobotStore.addFailed", res);
  },

  addCompleted(res) {
    // TODO update local storage?!
    console.log("RobotStore.addCompleted", res);
    let model = Map(res.data);
    this.setState(this.state.set(model.get("id"), model));
  },

  edit(model) {
    // TODO update local storage?!
    let id = model.get("id");
    let oldModel = this.state.get(id);
    this.setState(this.state.set(id, model));
    Axios.put(`/api/robots/${id}`, model.toJS())
      .catch(res => Actions.edit.failed(res, id, oldModel))
      .done(res => Actions.edit.completed(res, id, oldModel));
  },

  editFailed(res, id, oldModel) {
    console.debug("RobotStore.editFailed", res);
    this.setState(this.state.set(id, oldModel));
  },

  editCompleted(res, id, oldModel) {
    console.log("RobotStore.editCompleted", res);
  },

  remove(id) {
    // TODO update local storage?!
    let oldModel = this.state.get(id);
    this.setState(this.state.delete(id));
    Axios.delete(`/api/robots/${id}`)
      .catch(res => Actions.remove.failed(res, id, oldModel))
      .done(res => Actions.remove.completed(res, id, oldModel));
  },

  removeFailed(res, id, oldModel) {
    console.debug("RobotStore.removeFailed", res);
    this.setState(this.state.set(id, oldModel));
  },

  removeCompleted(res, id, oldModel) {
    console.log("RobotStore.removeCompleted", res);
  },
});

export default Store;
