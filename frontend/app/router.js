// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Route, DefaultRoute, NotFoundRoute, HistoryLocation} = Router;

// Common components
let Body = require("./common/components/body");
let Home = require("./common/components/home");
let About = require("./common/components/about");
let NotFound = require("./common/components/not-found");

// Robot components
let RobotIndex = require("./robot/components/index");
let RobotDetail = require("./robot/components/detail");
let RobotAdd = require("./robot/components/add");
let RobotEdit = require("./robot/components/edit");

// MAIN ============================================================================================
var routes = (
  <Route handler={Body} path="/">
    <DefaultRoute name="home" handler={Home}/>
    <Route name="robots-index" path="/robots/" handler={RobotIndex}/>
    <Route name="robots-add" path="/robots/add" handler={RobotAdd}/>
    <Route name="robots-detail" path="/robots/:id" handler={RobotDetail}/>
    <Route name="robots-edit" path="/robots/:id/edit" handler={RobotEdit}/>
    <Route name="about" path="/about" handler={About}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
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
