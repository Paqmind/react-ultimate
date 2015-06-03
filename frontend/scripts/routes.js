// IMPORTS =========================================================================================
import React from "react";

import {Route, DefaultRoute, NotFoundRoute} from "react-router";
import {Body, About, Tech, Credits, NotFound} from "frontend/scripts/components/page";

import RobotIndex from "frontend/scripts/components/index/robot";
import RobotDetail from "frontend/scripts/components/detail/robot";
import RobotAdd from "frontend/scripts/components/add/robot";
import RobotEdit from "frontend/scripts/components/edit/robot";

import MonsterIndex from "frontend/scripts/components/index/monster";
import MonsterDetail from "frontend/scripts/components/detail/monster";
import MonsterAdd from "frontend/scripts/components/add/monster";
import MonsterEdit from "frontend/scripts/components/edit/monster";

// Lazy Components: wait for React-Router to allow metadata passing!
// import RobotIndex from "react-proxy!frontend/scripts/components/index/robot";
// ...

// ROUTES ==========================================================================================
export default (
  <Route path="/" handler={Body}>
    <DefaultRoute name="about" handler={About}/>
    <Route path="/tech" name="tech" handler={Tech}/>
    <Route path="/credits" name="credits" handler={Credits}/>
    <NotFoundRoute handler={NotFound}/>

    <Route path="/robots/" name="robot-index" handler={RobotIndex}/>
    <Route path="/robots/add" name="robot-add" handler={RobotAdd}/>
    <Route path="/robots/:id" name="robot-detail" handler={RobotDetail}/>
    <Route path="/robots/:id/edit" name="robot-edit" handler={RobotEdit}/>

    <Route path="/monsters/" name="monster-index" handler={MonsterIndex}/>
    <Route path="/monsters/add" name="monster-add" handler={MonsterAdd}/>
    <Route path="/monsters/:id" name="monster-detail" handler={MonsterDetail}/>
    <Route path="/monsters/:id/edit" name="monster-edit" handler={MonsterEdit}/>
  </Route>
);
