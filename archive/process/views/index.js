var View = require("ampersand-view");

var templater = require("../../templater"),
    ItemView = require("./item");

// EXPORTS
module.exports = View.extend({
  template: templater.lazyRender("process/templates/index.html"),

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

  render: function () {
    this.renderWithTemplate();

    var collectionView = this.renderCollection(
      this.collection, ItemView, this.el.querySelector("tbody"), {}
    );

    return this;
  }
});
