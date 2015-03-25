// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Route, DefaultRoute, NotFoundRoute, HistoryLocation} = ReactRouter;

// Shims, polyfills
let Shims = require("./shims");

// Init stores
let RobotStore = require("frontend/robot/stores");
let AlertStore = require("frontend/alert/stores");

// Common
let Body = require("frontend/common/components/body");
let Home = require("frontend/common/components/home");
let About = require("frontend/common/components/about");
let NotFound = require("frontend/common/components/not-found");

// Robot
let RobotActions = require("frontend/robot/actions");
let RobotIndex = require("frontend/robot/components/index");
let RobotDetail = require("frontend/robot/components/detail");
let RobotAdd = require("frontend/robot/components/add");
let RobotEdit = require("frontend/robot/components/edit");

// ROUTES ==========================================================================================
let routes = (
  <Route handler={Body} path="/">
    <DefaultRoute name="home" handler={Home}/>
    <Route name="robot-index" handler={RobotIndex}/>
    <Route name="robot-detail" path=":id" handler={RobotDetail}/>
    <Route name="robot-edit" path=":id/edit" handler={RobotEdit}/>
    <Route name="about" path="/about" handler={About}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

//<Route name="robot-add" path="add" handler={RobotAdd}/>
//
//

window.router = ReactRouter.create({
  routes: routes,
  location: HistoryLocation
});

window.router.run((Handler, state) => {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  React.render(<Handler/>, document.body);
});

RobotActions.loadMany();