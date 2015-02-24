// IMPORTS =========================================================================================
let {List, Map, OrderedMap} = require("immutable");
let ReactRouter= require("react-router");
let Axios = require("axios");
let Reflux = require("reflux");
let Actions = require("../actions");

// EXPORTS =========================================================================================
let Store = Reflux.createStore({
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

  entryIndex() {
    if (this.indexLoaded) {
      this.setState();
    } else {
      // TODO check local storage
      Axios.get('/api/robots/')
        .catch(res => {
          this.resetState();
        })
        .done(res => {
          let models = List(res.data);
          this.setState(OrderedMap([for (model of models) [model.id, Map(model)]]));
          this.indexLoaded = true;
        });
    }
  },

  entryDetail(id) {
    if (this.state.has(id)) {
      this.setState();
    } else {
      // TODO check local storage?!
      Axios.get(`/api/robots/${id}`)
        .catch(res => {
          this.setState(this.state.set(id, "Not Found"));
        })
        .done(res => {
          let model = Map(res.data);
          this.setState(this.state.set(id, model));
        });
    }
  },

  entryEdit(id) {
    return this.entryDetail(id);
  },

  doAdd(model) {
    Axios.post(`/api/robots/`, model.toJS())
      .catch(res => {
        console.debug("Submit failed with `res`:", res);
      })
      .done(res => {
        // TODO update local storage?!
        console.log("Submit succeed with `res`:", res);
        let model = Map(res.data);
        this.setState(this.state.set(model.get("id"), model));
      });
  },

  doEdit(model) {
    let id = model.get("id");
    let oldModel = this.state.get(id);
    this.setState(this.state.set(id, model));
    // TODO update local storage?!
    Axios.put(`/api/robots/${id}`, model.toJS())
      .catch(res => {
        console.debug("Submit failed with `res`:", res);
        this.setState(this.state.set(id, oldModel));
      })
      .done(res => {
        console.log("Submit succeed with `res`:", res);
      });
  },

  doRemove(id, event) {
    console.log("RobotStore.doRemove!");
    let oldModel = this.state.get(id);
    this.setState(this.state.delete(id));
    // TODO update local storage?!
    Axios.delete(`/api/robots/${id}`)
      .catch(res => {
        console.debug("Submit failed with `res`:", res);
        this.setState(this.state.set(id, oldModel));
      })
      .done(res => {
        console.log("Submit succeed with `res`:", res);
      });
  },
});

export default Store;
