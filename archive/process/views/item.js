var View = require("ampersand-view");

var templater = require("../../templater");

module.exports = View.extend({
  template: templater.lazyRender("process/templates/item.html"),

//  initialize: function() {
//    this.listenToAndRun(this.model, "change", this.render);
//
//    this.listenToAndRun(this.collection, "change", this.render);
//    this.listenToAndRun(this.collection, "sync", this.render);

//    this.listenToAndRun(this.collection, "change", this.changeTracker);
//    this.listenToAndRun(this.collection, "sync", this.syncTracker);
//  },

  /*changeTracker: function() {
    console.log("Model changed!");
  },

  syncTracker: function() {
    console.log("Model synced!");
  },

  resetTracker: function() {
    console.log("Model reseted!");
  },*/

  bindings: {
    "model.pid": "[data-hook=pid]",
    "model.command": "[data-hook=command]",
    "model.user": "[data-hook=user]",

//    "model.name": {
//      type: "text",
//      hook: "name"
//    },

//    "model.avatarURL": {
//      type: "attribute",
//      name: "src",
//      hook: "avatar"
//    },

//    "model.selected": {
//      type: "booleanClass",
//      name: "active" //class to toggle
//    }
  },

  /*render: function() {
    this.renderWithTemplate({view: this});
    return this;
  },*/
});
