// IMPORTS =========================================================================================
let Request = require("superagent");
let Axios = require("axios");
let Reflux = require("reflux");

// EXPORTS =========================================================================================
let Actions = Reflux.createActions({
  //"toggleItem",     // called by button in TodoItem
  //"toggleAllItems", // called by button in TodoMain (even though you'd think TodoHeader)
  //"addItem",        // called by hitting enter in field in TodoHeader
  //"removeItem",     // called by button in TodoItem
  //"clearCompleted", // called by button in TodoFooter
  "getModels": {asyncResult: true},
  "getModel": {asyncResult: true},
  "postModel": {asyncResult: true},
  "putModel": {asyncResult: true},
  "deleteModel": {asyncResult: true},
  "addModel": {},
  "addRandomModel": {},
  "editModel": {},
});

// when 'getModels' is triggered, call async operation and trigger related actions
Actions.getModels.listen(function(opts) {
  // Child actions are accessible through `this`
  Axios.get('/api/robots/')
    .then((res) => {
      console.log(">>> then >>>", res.status);
      console.log(">>> then >>>", res.data);
      this.completed(res.data);
    })
    .catch((res) => {
      console.log(">>> catch >>>", res);
      console.log(">>> catch >>>", res.status);
      console.log(">>> catch >>>", res.data);
      self.failed(res.status);
    });
});

// when 'fetchModel' is triggered, call async operation and trigger related actions
Actions.getModel.listen(function(opts) {
  // Child actions are accessible through `this`
  let {id} = opts;
  Axios.get(`/api/robots/${id}`)
    .then((res) => {
      console.log(">>>", res.status);
      console.log(">>>", res.data);
      this.completed(res.data);
    })
    .catch((res) => {
      console.log(">>>", res.status);
      console.log(">>>", res.data);
      this.failed(res.status);
    });
});

Actions.postModel.listen((opts) => {
  //opts.headers["Content-Type"] = "application/json";
  let {headers, data} = opts;
  Axios.post(`/api/robots/`, {headers, data})
    .then((res) => {
      console.log(">>>", res.status);
      console.log(">>>", res.data);
      this.completed(res.data);
    })
    .catch((res) => {
      // TODO pull data back ?!
      console.log(">>>", res.status);
      console.log(">>>", res.data);
      this.failed(res.status);
    });
});

Actions.putModel.listen((opts) => {
  //opts.headers["Content-Type"] = "application/json";
  let {id, headers, data} = opts;
  Axios.put(`/api/robots/${id}`, {headers, data})
    .then((res) => {
      console.log(">>>", res.status);
      console.log(">>>", res.data);
      this.completed(res.data);
    }).catch((res) => {
      // TODO pull data back ?!
      console.log(">>>", res.status);
      console.log(">>>", res.data);
      this.failed(res.status);
    });
});

export default Actions;
