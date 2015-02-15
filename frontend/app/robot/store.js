// IMPORTS =========================================================================================
let Axios = require("axios");
let Reflux = require("reflux");
let CommonHelpers = require("../../../common/helpers");
let Actions = require("./actions");

// EXPORTS =========================================================================================
let Store = Reflux.createStore({
  // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
  listenables: [Actions],

  getInitialState() {
    return [];
  },

  // TODO: this should be at mixin level -----------------------------------------------------------
  init() {
    this.state = [];
    this.setState(this.getInitialState());
    //this.listenTo(Actions.getModels.completed, this.onFetchCompleted);
    //this.listenTo(Actions.getModels.failed, this.onLoadFailed);
    //Actions.getModels({name: "jac"});
  },

  entryIndex() {
    if (this.state.length) {
      this.shareState();
    } else {
      // TODO check local storage
      Axios.get('/api/robots/')
        .catch((res) => {
          this.resetState();
        })
        .done((res) => {
          this.setModels(res.data);
        });
    }
  },

  /*entryDetail(id) {
    if (this.state.length && this.getModel(id)) {
      this.shareState();
    } else {
      // TODO check local storage
      Axios.get(`/api/robots/${id}`)
        .catch((res) => {
          this.resetState();
        })
        .done((res) => {
          this.updateState({$push: res.data});
        });
    }
  },*/

  updateState(query) {
    this.state = React.addons.update(this.state, query);
    this.trigger(this.state);
  },

  resetState() {
    this.setState(this.getInitialState());
  },

  getModel(id) {
    for (let model of this.state) {
      if (model.id === id) {
        return model;
      }
    }
    return undefined;
  },

  updateModel(model) {
    let models = [].concat(this.state);
    for (let i=0; i < models.length; i++) {
      if (models[i].id == model.id) {
        models[i] = model;
        break;
      }
    }
    this.setState(models);
  },

  removeModel(id) {
    this.setState(
      this.state.filter(model => model.id != id)
    );
  },

  shareState() {
    this.trigger(this.state);
  },

  setState(state) {
    this.state = state;
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
          this.removeModel(id);
        });
    } else {
      alert("Empty data!");
    }
  },*/

  /*editRobot(id, data) {
    let model = this.getModel(id);
    if (model) {
      let model = this.updateState()updateModel(data);
      Actions.putModel.triggerPromise(model) // TODO should be in 0.2.6 by default for async actions
        .catch((status) => {
          this.removeModel(id);
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
