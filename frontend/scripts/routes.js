// IMPORTS =========================================================================================
import React from "react";
import {Route, DefaultRoute, NotFoundRoute} from "react-router";
import {Body, About, Tech, Credits, NotFound} from "frontend/components";

import RobotIndex from "frontend/robot/components/index";
import RobotAdd from "frontend/robot/components/add";
import RobotDetail from "frontend/robot/components/detail";
import RobotEdit from "frontend/robot/components/edit";

import MonsterIndex from "frontend/monster/components/index";
import MonsterAdd from "frontend/monster/components/add";
import MonsterDetail from "frontend/monster/components/detail";
import MonsterEdit from "frontend/monster/components/edit";

// ROUTES ==========================================================================================
export default (
  <Route path="/" handler={Body}>
    <DefaultRoute handler={About} name="about"/>
    <Route path="/robots/" name="robot-index" handler={RobotIndex}/>
    <Route path="/robots/add" name="robot-add" handler={RobotAdd}/>
    <Route path="/robots/:id" name="robot-detail" handler={RobotDetail}/>
    <Route path="/robots/:id/edit" name="robot-edit" handler={RobotEdit}/>

    <Route path="/monsters/" name="monster-index" handler={MonsterIndex}/>
    <Route path="/monsters/add" name="monster-add" handler={MonsterAdd}/>
    <Route path="/monsters/:id" name="monster-detail" handler={MonsterDetail}/>
    <Route path="/monsters/:id/edit" name="monster-edit" handler={MonsterEdit}/>

    <Route path="/tech" name="tech" handler={Tech}/>
    <Route path="/credits" name="credits" handler={Credits}/>

    <NotFoundRoute handler={NotFound}/>
  </Route>
);