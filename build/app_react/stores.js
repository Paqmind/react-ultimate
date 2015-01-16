"use strict";

// IMPORTS =========================================================================================
var Reflux = require("reflux");
var Actions = require("./actions");

// some variables and helpers for our fake database stuff
function getItemByKey(list, itemKey) {
  return _.find(list, function (item) {
    return item.key === itemKey;
  });
}

var todoListStore = Reflux.createStore({
  init: function () {
    this.todoCounter = 0;
    this.localStorageKey = "todos";
  },

  // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
  listenables: [Actions],
  onEditItem: function (itemKey, newLabel) {
    var foundItem = getItemByKey(this.list, itemKey);
    if (!foundItem) {
      return;
    }
    foundItem.label = newLabel;
    this.updateList(this.list);
  },
  onAddItem: function (label) {
    this.updateList([{
      key: this.todoCounter += 1,
      created: new Date(),
      isComplete: false,
      label: label
    }].concat(this.list));
  },
  onRemoveItem: function (itemKey) {
    this.updateList(_.filter(this.list, function (item) {
      return item.key !== itemKey;
    }));
  },
  onToggleItem: function (itemKey) {
    var foundItem = getItemByKey(this.list, itemKey);
    if (foundItem) {
      foundItem.isComplete = !foundItem.isComplete;
      this.updateList(this.list);
    }
  },
  onToggleAllItems: function (checked) {
    this.updateList(_.map(this.list, function (item) {
      item.isComplete = checked;
      return item;
    }));
  },
  onClearCompleted: function () {
    this.updateList(_.filter(this.list, function (item) {
      return !item.isComplete;
    }));
  },
  // called whenever we change a list. normally this would mean a database API call
  updateList: function (list) {
    localStorage.setItem(localStorageKey, JSON.stringify(list));
    // if we used a real database, we would likely do the below in a callback
    this.list = list;
    this.trigger(list); // sends the updated list to all listening components (TodoApp)
  },
  // this will be called by all listening components as they register their listeners
  getDefaultData: function () {
    var _this = this;
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
      this.list = JSON.parse(loadedList).map(function (item) {
        // just resetting the key property for each todo item
        item.key = _this.todoCounter;
        _this.todoCounter += 1;
        return item;
      });
    }
    return this.list;
  }
});