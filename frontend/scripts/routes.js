// IMPORTS =========================================================================================
import React from "react";

// Eager Components
import {Route, DefaultRoute, NotFoundRoute} from "react-router";
import {Body, About, Tech, Credits, NotFound} from "frontend/components/page";

// Lazy Components
//import {RobotIndex, RobotAdd, RobotDetail, RobotEdit} from "react-proxy!frontend/components/model/robot";
//import {MonsterIndex, MonsterAdd, MonsterDetail, MonsterEdit} from "react-proxy!frontend/components/model/monster";
// Not compatible. Check for React-Router to allow metadata passing!
import {RobotIndex} from "frontend/components/model/robot";

// ROUTES ==========================================================================================
export default (
  <Route path="/" handler={Body}>
    <DefaultRoute name="about" handler={About}/>
    <Route path="/tech" name="tech" handler={Tech}/>
    <Route path="/credits" name="credits" handler={Credits}/>
    <NotFoundRoute handler={NotFound}/>

    <Route path="/robots/" name="robot-index" handler={RobotIndex}/>
  </Route>
);
