var View = require("ampersand-view");

var templater = require("../templater");

module.exports = View.extend({
  template: templater.lazyRender("summary/template.html"),

  initialize: function() {
//    this.listenToAndRun(this.model, "change", this.render);
//
//    this.listenToAndRun(this.collection, "change", this.render);
//    this.listenToAndRun(this.collection, "sync", this.render);

//    this.listenToAndRun(this.collection, "change", this.changeTracker);
//    this.listenToAndRun(this.collection, "sync", this.syncTracker);
  },

  /*changeTracker: function() {
    console.log("Model changed!");
  },

  syncTracker: function() {
    console.log("Model synced!");
  },

  resetTracker: function() {
    console.log("Model reseted!");
  },*/

  /*render: function() {
    console.log(">>", this.model);
    console.log(">>", this.model.toJSON());
    this.renderWithTemplate({view: this});
    return this;
  },*/
});
