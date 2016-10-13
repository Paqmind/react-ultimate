import React from "react"

// Eager Components
import {Route, DefaultRoute, NotFoundRoute} from "react-router"
import Body from "frontend/components/body"
import {About, Tech, Credits} from "frontend/components/page"
import {NotFound} from "frontend/components/common"

//Lazy Components
//import {RobotIndex, RobotAdd, RobotDetail, RobotEdit} from "react-proxy!frontend/components/robot"
//import {MonsterIndex, MonsterAdd, MonsterDetail, MonsterEdit} from "react-proxy!frontend/components/monster"
//Not compatible. Check for React-Router to allow metadata passing!
import {RobotIndex, RobotAdd, RobotDetail, RobotEdit} from "frontend/components/robot"
import {MonsterIndex, MonsterAdd, MonsterDetail, MonsterEdit} from "frontend/components/monster"

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
)
