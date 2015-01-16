"use strict";

var _ = require("6to5/polyfill");
//    domReady = require('domready');

var Router = require("ampersand-router");

var BodyView = require("./common/views/body"), HomeView = require("./common/views/home"), InfoView = require("./common/views/info"), RobotIndexView = require("./robot/views/index"), RobotAddView = require("./robot/views/add"), RobotEditView = require("./robot/views/edit"), RobotDetailView = require("./robot/views/detail");

//    PersonAddPage = require("./../../client/pages/person-add"),
//    PersonEditPage = require("./../../client/pages/person-edit"),
//    PersonViewPage = require("./../../client/pages/person-view");

//var ld = require("lodash");
//var logger = require("andlog");
//var config = require("clientconfig");
//
//var Router = require("./router");
//var tracking = require("./helpers/metrics");
//var MainView = require("./views/main");
//var Me = require("./models/me");
//var People = require("./models/persons");
//var domReady = require("domready");

var App = Router.extend({
  initialize: function () {
    var self = window.app = this;
    this.bodyView = new BodyView({ el: document.body }).render(); // model: me,
  },

  navigate: function (page) {
    var url = (page.charAt(0) === "/") ? page.slice(1) : page;
    this.history.navigate(url, { trigger: true });
  },

  routes: {
    "": "home",
    info: "info",
    robots: "indexRobots",
    "robots/add": "addRobot",
    "robots/:id": "detailRobot",
    "robots/:id/edit": "editRobot",
    "(*path)": "catchAll"
  },

  home: function () {
    this.trigger("page", new HomeView({}));
  },

  info: function () {
    this.trigger("page", new InfoView({}));
  },

  indexRobots: function () {
    this.trigger("page", new RobotIndexView({
      //      model: me,
      collection: this.bodyView.robots
    }));
  },

  addRobot: function () {
    console.log("Add");
    this.trigger("page", new RobotAddView({
      collection: this.bodyView.robots }));
  },

  editRobot: function (id) {
    console.log("Edit");
    this.trigger("page", new RobotEditView({
      collection: this.bodyView.robots,
      id: id
    }));
  },

  detailRobot: function (id) {
    console.log("Detail");
    this.trigger("page", new RobotDetailView({
      collection: this.bodyView.robots,
      id: id
    }));
  },

  catchAll: function () {
    this.redirectTo("");
  }
});

// RUN
//domReady(function() {
var app = new App();
app.history.start({ pushState: true, root: "/" });
//});