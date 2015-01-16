"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var HistoryLocation = Router.HistoryLocation;
var Body = require("./components/body");
var Home = require("./components/home");
var About = require("./components/about");
var RobotsIndex = require("./components/robots-index");
var RobotsDetail = require("./components/robots-detail");
var RobotsEdit = require("./components/robots-edit");
var NotFound = require("./components/not-found");

// MAIN ============================================================================================
var routes = React.createElement(
  Route,
  { handler: Body, path: "/" },
  React.createElement(DefaultRoute, { name: "home", handler: Home }),
  React.createElement(
    Route,
    { name: "robots-index", path: "/robots/", handler: RobotsIndex },
    React.createElement(Route, { name: "robots-detail", path: ":id", handler: RobotsDetail }),
    React.createElement(Route, { name: "robots-edit", path: ":id/edit", handler: RobotsEdit })
  ),
  React.createElement(Route, { name: "about", path: "/about", handler: About }),
  React.createElement(NotFoundRoute, { handler: NotFound })
);

module.exports = Router.create({
  routes: routes,
  location: Router.HistoryLocation
});

// Import router and invoke its methods:
// router.transitionTo('somewhere');

//routes: {
//  "": "home",
//  "info": "info",
//  "robots": "indexRobots",
//  "robots/add": "addRobot",
//  "robots/:id": "detailRobot",
//  "robots/:id/edit": "editRobot",
//  "(*path)": "catchAll"
//},


/*
exports.DefaultRoute = require('./components/DefaultRoute');
exports.Link = require('./components/Link');
exports.NotFoundRoute = require('./components/NotFoundRoute');
exports.Redirect = require('./components/Redirect');
exports.Route = require('./components/Route');
exports.RouteHandler = require('./components/RouteHandler');

exports.HashLocation = require('./locations/HashLocation');
exports.HistoryLocation = require('./locations/HistoryLocation');
exports.RefreshLocation = require('./locations/RefreshLocation');

exports.ImitateBrowserBehavior = require('./behaviors/ImitateBrowserBehavior');
exports.ScrollToTopBehavior = require('./behaviors/ScrollToTopBehavior');

exports.Navigation = require('./mixins/Navigation');
exports.State = require('./mixins/State');

exports.create = require('./utils/createRouter');
exports.run = require('./utils/runRouter');

exports.History = require('./utils/History');
*/