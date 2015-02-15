// IMPORTS =========================================================================================
import {List, OrderedMap as OM} from "immutable";
import Axios from "axios";
import Reflux from "reflux";
import CommonHelpers from "../../../common/helpers";
import Actions from "./actions";

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

  entryIndex() {
    if (this.state.size) {
      this.shareState();
    } else {
      // TODO check local storage
      Axios.get('/api/robots/')
        .catch((res) => {
          this.resetState();
        })
        .done((res) => {
          let models = List(res.data).sortBy((model) => model.id);
          this.setState(OM([for (model of models) [model.id, model]]));
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
          let model = Map(res.data);
          this.setState(this.state.set(model.id, model));
        });
    }
  },*/

  resetState() {
    this.setState(this.getInitialState());
  },

  setState(state) {
    this.state = state;
    this.trigger(this.state);
  },

  shareState() {
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
