/*global $*/
// base view for pages
var View = require("ampersand-view");
//    ld = require("lodash");
//    keymaster = require("keymaster");

module.exports = View.extend({
  // register keyboard handlers
  registerKeyboardShortcuts: function () {
    /*
    var self = this;
    _.each(this.keyboardShortcuts, function (value, k) {
        // register key handler scoped to this page
        keymaster(k, self.cid, _.bind(self[value], self));
    });
    keymaster.setScope(this.cid);
    */
  },
  unregisterKeyboardShortcuts: function () {
    //keymaster.deleteScope(this.cid);
  }
});
