// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Route, DefaultRoute, NotFoundRoute, HistoryLocation} = ReactRouter;

// Common components
let Body = require("./common/components/body");
let Home = require("./common/components/home");
let About = require("./common/components/about");
let NotFound = require("./common/components/not-found");

// Robot components
let RobotRoot = require("./robot/components/root");
let RobotIndex = require("./robot/components/index");
let RobotDetail = require("./robot/components/detail");
let RobotAdd = require("./robot/components/add");
let RobotEdit = require("./robot/components/edit");

// ROUTES ==========================================================================================
var routes = (
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

let router = ReactRouter.create({
  routes: routes,
  location: ReactRouter.HistoryLocation
});

export default router;
