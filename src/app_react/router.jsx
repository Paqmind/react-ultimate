// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Route, DefaultRoute, NotFoundRoute, HistoryLocation} = Router;
let Body = require("./components/body");
let Home = require("./components/home");
let About = require("./components/about");
let RobotsIndex = require("./components/robots-index");
let RobotsDetail = require("./components/robots-detail");
let RobotsEdit = require("./components/robots-edit");
let NotFound = require("./components/not-found");

// MAIN ============================================================================================
var routes = (
  <Route handler={Body} path="/">
    <DefaultRoute name="home" handler={Home}/>
    <Route name="robots-index" path="/robots/" handler={RobotsIndex}>
      <Route name="robots-detail" path=":id" handler={RobotsDetail}/>
      <Route name="robots-edit" path=":id/edit" handler={RobotsEdit}/>
    </Route>
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
