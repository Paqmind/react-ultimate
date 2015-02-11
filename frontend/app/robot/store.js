// IMPORTS =========================================================================================
let Reflux = require("reflux");
let CommonHelpers = require("../../../common/helpers");
let Actions = require("./actions");

// EXPORTS =========================================================================================
let Store = Reflux.createStore({
  // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
  //listenables: [Actions],

  // TODO: this should be at mixin level -----------------------------------------------------------
  init() {
    console.debug("RobotStore.init");
    this.state = {};
    this.setState(this.getInitialState());
    this.listenTo(Actions.getModels.completed, this.onFetchCompleted);
    this.listenTo(Actions.getModels.failed, this.onLoadFailed);
    Actions.getModels({name: "jac"});
  },

  getModel(id) {
    for (let model of this.state.models) {
      if (model.id == id) {
        return model;
      }
    }
    return undefined;
  },

  addModel(model) {
    let models = this.state.models.concat([model]);
    this.setState({models});
  },

  updateModel(model) {
    let models = this.state.models;
    for (let i=0; i < models.length; i++) {
      if (models[i].id == model.id) {
        models[i] = model;
        break;
      }
    }
    this.setState({models});
  },

  removeModel(id) {
    let models = this.state.models.filter(model => model.id != id);
    this.setState({models});
  },

  onFetchCompleted(models) {
    console.debug("RobotModes.onFetchCompleted", models);
    this.setState({models: models});
  },

  onFetchFailed(status) {
    // TODO ???
    this.setState(this.getInitialState());
  },

  setState(state) {
    this.state = Object.assign(this.state, state);
    this.trigger(this.state);
  },

  replaceState(state) {
    this.state = state;
    this.trigger(this.state);
  },
  //------------------------------------------------------------------------------------------------

  onAddRandom() {
    let robot = CommonHelpers.generateRandom(CommonHelpers.maxId(this.state.models) + 1);
    this.setState({
      models: this.state.models.concat([robot])
    });
  },

  getInitialState() {
    return {
      models: [],
    };
  },

  addRobot(data) {
    if (data) {
      let model = this.addModel(data);
      Actions.postModel.triggerPromise(model) // TODO should be in 0.2.6 by default for async actions
        .catch((status) => {
          this.removeModel(id);
        });
    } else {
      alert("Empty data!");
    }
  },

  editRobot(id, data) {
    let model = this.getModel(id);
    if (model) {
      let model = this.updateModel(data);
      Actions.putModel.triggerPromise(model) // TODO should be in 0.2.6 by default for async actions
        .catch((status) => {
          this.removeModel(id);
        });
    } else {
      alert(`Not found robot with id ${id}!`);
    }
  },

  removeRobot(id) {
    let model = this.getModel(id);
    if (model) {
      let model = this.removeModel(data);
      Actions.deleteModel.triggerPromise(model) // TODO should be in 0.2.6 by default for async actions
        .catch((status) => {
          this.addModel(model);
        });
    } else {
      alert(`Not found robot with id ${id}!`);
    }
  },

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
