// IMPORTS =========================================================================================
let {List, Map, OrderedMap} = require("immutable");
let Axios = require("axios");
let Reflux = require("reflux");
let ReactRouter= require("react-router");
let RobotActions = require("frontend/robot/actions");

// EXPORTS =========================================================================================
let RobotStore = Reflux.createStore({
  // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
  listenables: [RobotActions],

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
  loadMany() {
    // TODO check local storage
    if (this.indexLoaded) {
      this.shareState();
    } else {
      this.stopListeningTo(RobotActions.loadMany);
      RobotActions.loadMany.promise(Axios.get('/api/robots/'));
    }
  },

  loadManyFailed(res) {
    //console.echo("RobotStore.loadManyFailed", res);
    this.resetState();
    this.listenTo(RobotActions.loadMany, this.loadMany);
  },

  loadManyCompleted(res) {
    //console.echo("RobotStore.loadManyCompleted", res);
    let models = List(res.data);
    this.setState(OrderedMap([for (model of models) [model.id, Map(model)]]));
    this.indexLoaded = true;
    this.listenTo(RobotActions.loadMany, this.loadMany);
  },

  loadOne(id) {
    // TODO check local storage?!
    this.stopListeningTo(RobotActions.loadOne);
    if (this.state.has(id)) {
      this.shareState();
    } else {
      // TODO check local storage?!
      Axios.get(`/api/robots/${id}`)
        .catch(res => RobotActions.loadOne.failed(res, id))
        .then(res => RobotActions.loadOne.completed(res, id));
    }
  },

  loadOneFailed(res, id) {
    //console.echo("RobotStore.loadManyFailed", res, id);
    this.setState(this.state.set(id, "Not Found"));
    this.listenTo(RobotActions.loadOne, this.loadOne);
  },

  loadOneCompleted(res, id) {
    //console.echo("RobotStore.loadOneCompleted", id);
    let model = Map(res.data);
    this.setState(this.state.set(id, model));
    this.listenTo(RobotActions.loadOne, this.loadOne);
  },

  add(model) {
    RobotActions.add.promise(Axios.post(`/api/robots/`, model.toJS()));
  },

  addFailed(res) {
    //console.echo("RobotStore.addFailed", res);
  },

  addCompleted(res) {
    // TODO update local storage?!
    //console.echo("RobotStore.addCompleted", res);
    let model = Map(res.data);
    this.setState(this.state.set(model.get("id"), model));
  },

  edit(model) {
    // TODO update local storage?!
    let id = model.get("id");
    let oldModel = this.state.get(id);
    this.setState(this.state.set(id, model));
    Axios.put(`/api/robots/${id}`, model.toJS())
      .catch(res => RobotActions.edit.failed(res, id, oldModel))
      .done(res => RobotActions.edit.completed(res, id, oldModel));
  },

  editFailed(res, id, oldModel) {
    //console.echo("RobotStore.editFailed", res);
    this.setState(this.state.set(id, oldModel));
  },

  editCompleted(res, id, oldModel) {
    //console.echo("RobotStore.editCompleted", res);
  },

  remove(id) {
    // TODO update local storage?!
    let oldModel = this.state.get(id);
    this.setState(this.state.delete(id));
    Axios.delete(`/api/robots/${id}`)
      .catch(res => RobotActions.remove.failed(res, id, oldModel))
      .done(res => RobotActions.remove.completed(res, id, oldModel));
  },

  removeFailed(res, id, oldModel) {
    //console.echo("RobotStore.removeFailed", res);
    this.setState(this.state.set(id, oldModel));
  },

  removeCompleted(res, id, oldModel) {
    //console.echo("RobotStore.removeCompleted", res);
  },
});

export default RobotStore;
