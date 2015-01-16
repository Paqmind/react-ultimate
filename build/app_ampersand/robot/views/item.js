"use strict";

var View = require("ampersand-view");

var templater = require("../../templater");

module.exports = View.extend({
  template: templater.lazyRender("robot/templates/item.html"),

  bindings: {
    "model.fullName": "[data-hook=action-detail]",

    "model.avatar": {
      type: "attribute",
      hook: "avatar",
      name: "src"
    },

    "model.editUrl": {
      type: "attribute",
      hook: "action-edit",
      name: "href"
    },

    "model.viewUrl": {
      type: "attribute",
      hook: "action-detail",
      name: "href"
    }
  },

  events: {
    "click [data-hook=action-remove]": "handleDestroyClick"
  },

  handleDestroyClick: function () {
    this.model.destroy();
    return false;
  }
});