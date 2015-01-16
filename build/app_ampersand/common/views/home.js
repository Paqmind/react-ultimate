"use strict";

var templater = require("../../templater"), PageView = require("./page");

module.exports = PageView.extend({
  seoTitle: "Home SEO title",

  template: templater.lazyRender("common/templates/home.html") });