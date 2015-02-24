// IMPORTS =========================================================================================
let {List, Map, OrderedMap: OM} = require("immutable");
let ReactRouter= require("react-router");
let Axios = require("axios");
let Reflux = require("reflux");
let SharedHelpers = require("../../../shared/helpers");
let Actions = require("./actions");

// EXPORTS =========================================================================================
let Store = Reflux.createStore({
  // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
  listenables: [Actions],

  getInitialState() {
    return OM();
  },

  // TODO: this should be at mixin level -----------------------------------------------------------
  init() {
    this.resetState();
  },

  loadMany() {
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
  },

  loadManyCompleted(res) {
    console.log("RobotStore.loadManyCompleted", res);
    let models = List(res.data);
    this.setState(OM([for (model of models) [model.id, Map(model)]]));
    this.indexLoaded = true;
  },

  loadOne(id) {
    // TODO check local storage?!
    if (this.state.has(id)) {
      this.setState();
    } else {
      Axios.get(`/api/robots/${id}`)
        .catch(res => Actions.loadOne.failed(res, id))
        .then(res => Actions.loadOne.completed(res, id));
    }
  },

  loadOneFailed(res, id) {
    console.log("RobotStore.loadManyFailed", res, id);
    this.setState(this.state.set(id, "Not Found"));
  },

  loadOneCompleted(res, id) {
    console.log("RobotStore.loadOneCompleted", id);
    let model = Map(res.data);
    this.setState(this.state.set(id, model));
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

  /*onAddRandom() {
    let robot = CommonHelpers.generateRandom(); // TODO use backend API instead
    this.setState({
      models: this.state.models.concat([robot])
    });
  },*/

  /*addRobot(data) {
    if (data) {
      let model = this.updateState({$push: data});
      Actions.postModel.triggerPromise(model) // TODO should be in 0.2.6 by default for async actions
        .catch((status) => {
          this.setState(this.state.remove(id));
        });
    } else {
      alert("Empty data!");
    }
  },*/

  /*editRobot(id, data) {
    let model = this.getModel(id);
    if (model) {
      let model = ...
      Actions.putModel.triggerPromise(model) // TODO should be in 0.2.6 by default for async actions
        .catch((status) => {
          this.setState(this.state.remove(id));
        });
    } else {
      alert(`Not found robot with id ${id}!`);
    }
  },*/

  /*removeRobot(id) {
    let model = this.getModel(id);
    if (model) {
      let model = this.removeModel(data);
      Actions.deleteModel.triggerPromise(model) // TODO should be in 0.2.6 by default for async actions
        .catch((status) => {
          this.updateState({$push: model});
        });
    } else {
      alert(`Not found robot with id ${id}!`);
    }
  },*/

  //onRemoveItem(itemKey) {
  //  this.updateList(_.filter(this.list,function(item){
  //    return item.key!==itemKey;
  //  }));
  //},

  //onToggleItem(itemKey) {
  //  var foundItem = getItemByKey(this.list,itemKey);
  //  if (foundItem) {
  //    foundItem.isComplete = !foundItem.isComplete;
  //    this.updateList(this.list);
  //  }
  //},

  //onToggleAllItems(checked) {
  //  this.updateList(_.map(this.list, function(item) {
  //    item.isComplete = checked;
  //    return item;
  //  }));
  //},

  //onClearCompleted() {
  //  this.updateList(_.filter(this.list, function(item) {
  //    return !item.isComplete;
  //  }));
  //},
});

export default Store;
