// IMPORTS =========================================================================================
let React = require("react");
let {Route, DefaultRoute, NotFoundRoute} = require("react-router");

// Components
let {Body, Home, About, NotFound} = require("frontend/common/components");

let RobotIndex = require("frontend/robot/components/index");
let RobotAdd = require("frontend/robot/components/add");
let RobotDetail = require("frontend/robot/components/detail");
let RobotEdit = require("frontend/robot/components/edit");

// ROUTES ==========================================================================================
export default (
  <Route path="/" handler={Body}>
    <DefaultRoute handler={Home} name="home"/>
    <Route path="/about" name="about" handler={About}/>
    <Route path="/robots/page/:page" name="robot-index" handler={RobotIndex}/>
    <Route path="/robots/add" name="robot-add" handler={RobotAdd}/>
    <Route path="/robots/:id" name="robot-detail" handler={RobotDetail}/>
    <Route path="/robots/:id/edit" name="robot-edit" handler={RobotEdit}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);