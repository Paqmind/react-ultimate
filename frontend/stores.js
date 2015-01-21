// IMPORTS =========================================================================================
let Request = require("superagent");
let Reflux = require("reflux");
let Helpers = require("./helpers");
let robotActions = require("./actions").robotActions;

exports.robotStore = Reflux.createStore({
  // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
  listenables: [robotActions],

  //init: function() {
  //  this.todoCounter = 0;
  //  this.localStorageKey = "todos";
  //},

  getInitialState: function() {
    console.debug("robotStore.getInitialState");
    return {
      models: [
        {id: 1, fullname: "Jac"},
        {id: 2, fullname: "Jab"},
      ],
    };

    /*
    var loadedList = localStorage.getItem(this.localStorageKey);
    if (!loadedList) {
      // If no list is in localstorage, start out with a default one
      this.list = [{
        key: this.todoCounter += 1,
        created: new Date(),
        isComplete: false,
        label: "Rule the web"
      }];
    } else {
      this.list = JSON.parse(loadedList).map(item => {
        // just resetting the key property for each todo item
        item.key = this.todoCounter;
        this.todoCounter += 1;
        return item;
      });
    }
    return this.list;
    */
  },

  addRobot: function(data) {
    console.debug("robotStore.addRobot");
    console.log(data);
    // TODO make model from data ?!
    //localStorage.setItem(localStorageKey, JSON.stringify(list));
    this.models = Helpers.addModel(this.models, data);
    //Request
    //  .post("/robots")
    //  .set("Content-Type", "application/json")
    //  .send(JSON.stringify(data))
    //  .end(function(res) {
    //    if (res.ok) {
    //      alert("Yay got " + JSON.stringify(res.body));
    //      this.trigger(this.models);
    //    } else {
    //      // TODO pull data back ?!
    //      alert("Oh no! Error " + res.text);
    //    }
    //  });
  },

  onEditRobot: function(data) {
    // TODO make model from data ?!
    //localStorage.setItem(localStorageKey, JSON.stringify(list));
    var robot = getModel(this.models, data.id);
    if (robot) {
      Helpers.updateModel(this.models, data);
      Request
        .put("/robots/" + data.id)
        .set("Content-Type", "application/json")
        .send(JSON.stringify(data))
        .end(function(res) {
          if (res.ok) {
            alert("Yay got " + JSON.stringify(res.body));
            this.trigger(this.models);
          } else {
            // TODO pull data back ?!
            alert("Oh no! Error " + res.text);
          }
        });
    } else {
      alert("Not found robot with id " + data.id + "!");
    }
  },

  //onRemoveItem: function(itemKey) {
  //  this.updateList(_.filter(this.list,function(item){
  //    return item.key!==itemKey;
  //  }));
  //},

  //onToggleItem: function(itemKey) {
  //  var foundItem = getItemByKey(this.list,itemKey);
  //  if (foundItem) {
  //    foundItem.isComplete = !foundItem.isComplete;
  //    this.updateList(this.list);
  //  }
  //},

  //onToggleAllItems: function(checked) {
  //  this.updateList(_.map(this.list, function(item) {
  //    item.isComplete = checked;
  //    return item;
  //  }));
  //},

  //onClearCompleted: function() {
  //  this.updateList(_.filter(this.list, function(item) {
  //    return !item.isComplete;
  //  }));
  //},
});
