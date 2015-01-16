"use strict";

var templater = require("../../templater"), PageView = require("./page");

module.exports = PageView.extend({
  seoTitle: "Info SEO title",

  template: templater.lazyRender("common/templates/info.html") });