// SHIMS ===========================================================================================
let inspect = require("util-inspect");
Object.assign = require("object-assign");

Promise.prototype.done = function(onFulfilled, onRejected) {
  this
    .then(onFulfilled, onRejected)
    .catch(function(e) {
      setTimeout(function() { throw e; }, 1);
    });
};

window.console.echo = function log() {
  console.log.apply(console, Array.prototype.slice.call(arguments).map(v => inspect(v)));
};

// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Route, DefaultRoute, NotFoundRoute, HistoryLocation} = ReactRouter;

// Init stores
let RobotStore = require("frontend/robot/stores");
let AlertStore = require("frontend/alert/stores");

// Common components
let Body = require("frontend/common/components/body");
let Home = require("frontend/common/components/home");
let About = require("frontend/common/components/about");
let NotFound = require("frontend/common/components/not-found");

// Robot components
let RobotRoot = require("frontend/robot/components/root");
let RobotIndex = require("frontend/robot/components/index");
let RobotDetail = require("frontend/robot/components/detail");
let RobotAdd = require("frontend/robot/components/add");
let RobotEdit = require("frontend/robot/components/edit");

// ROUTES ==========================================================================================
let routes = (
  <Route handler={Body} path="/">
    <DefaultRoute name="home" handler={Home}/>
    <Route name="robot" path="/robots/" handler={RobotRoot}>
      <DefaultRoute name="robot-index" handler={RobotIndex}/>
      <Route name="robot-add" path="add" handler={RobotAdd}/>
      <Route name="robot-detail" path=":id" handler={RobotDetail}/>
      <Route name="robot-edit" path=":id/edit" handler={RobotEdit}/>
    </Route>
    <Route name="about" path="/about" handler={About}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

window.router = ReactRouter.create({
  routes: routes,
  location: HistoryLocation
});

window.router.run(function(Handler, state) {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  React.render(<Handler/>, document.body);
});

