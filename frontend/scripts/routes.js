// IMPORTS =========================================================================================
let React = require("react");
let {Route, DefaultRoute, NotFoundRoute} = require("react-router");

// Components
let Body = require("frontend/common/components/body");
let Home = require("frontend/common/components/home");
let About = require("frontend/common/components/about");
let NotFound = require("frontend/common/components/notfound");

let RobotIndex = require("frontend/robot/components/index");
let RobotAdd = require("frontend/robot/components/add");
let RobotDetail = require("frontend/robot/components/detail");
let RobotEdit = require("frontend/robot/components/edit");

// ROUTES ==========================================================================================
let routes = (
  <Route handler={Body} path="/">
    <DefaultRoute name="home" handler={Home}/>
    <Route name="about" path="/about" handler={About}/>
    <Route name="robot-index" handler={RobotIndex}/>
    <Route name="robot-add" path="add" handler={RobotAdd}/>
    <Route name="robot-detail" path=":id" handler={RobotDetail}/>
    <Route name="robot-edit" path=":id/edit" handler={RobotEdit}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

export default routes;