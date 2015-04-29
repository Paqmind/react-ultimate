// IMPORTS =========================================================================================
import React from "react";
import {Route, DefaultRoute, NotFoundRoute} from "react-router";

// Components
import {Body, Home, About, NotFound} from "frontend/common/components";

import RobotIndex from "frontend/robot/components/index";
import RobotAdd from "frontend/robot/components/add";
import RobotDetail from "frontend/robot/components/detail";
import RobotEdit from "frontend/robot/components/edit";

// ROUTES ==========================================================================================
export default (
  <Route path="/" handler={Body}>
    <DefaultRoute handler={Home} name="home"/>
    <Route path="/about" name="about" handler={About} loader="xxx"/>
    <Route path="/robots/" name="robot-index" handler={RobotIndex}/>
    <Route path="/robots/add" name="robot-add" handler={RobotAdd}/>
    <Route path="/robots/:id" name="robot-detail" handler={RobotDetail}/>
    <Route path="/robots/:id/edit" name="robot-edit" handler={RobotEdit}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);