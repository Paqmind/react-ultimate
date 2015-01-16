"use strict";

var templater = require("../../templater"), PageView = require("../../common/views/page"), ModelForm = require("../forms/model"), ItemView = require("./item");

module.exports = PageView.extend({
  pageTitle: "Detail Robot",
  seoTitle: "Robot Detail SEO title",

  template: templater.lazyRender("robot/templates/detail.html"),

  initialize: function (spec) {
    var self = this;
    this.collection.getOrFetch(spec.id, { all: true }, function (err, model) {
      if (err) alert("Couldn't find a model with id: {spec.id}");
      self.model = model;
    });
  },

  bindings: {
    "model.fullName": {
      hook: "fullName" },

    "model.avatar": {
      hook: "avatar",
      type: "attribute",
      name: "src" },

    "model.editUrl": {
      hook: "action-edit",
      type: "attribute",
      name: "href" }
  },

  events: {
    "click [data-hook=action-remove]": "handleRemove" },

  handleRemove: function () {
    this.model.destroy({ success: function () {
        window.app.navigate("robots");
      } });
  }
});