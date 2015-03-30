(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
//let ReactRouter = require("react-router");
//let {Route, DefaultRoute, NotFoundRoute, HistoryLocation} = ReactRouter;

// Shims, polyfills
//let Shims = require("./shims");

console.log("test");

// Common
//let Body = require("frontend/common/components/body");
//let Home = require("frontend/common/components/home");
//let About = require("frontend/common/components/about");
//let NotFound = require("frontend/common/components/notfound");

// Alert
//let loadManyAlerts = require("frontend/alert/actions/loadmany");

// Robot
//let loadManyRobots = require("frontend/robot/actions/loadmany");
//let RobotIndex = require("frontend/robot/components/index");
//let RobotAdd = require("frontend/robot/components/add");
//let RobotDetail = require("frontend/robot/components/detail");
//let RobotEdit = require("frontend/robot/components/edit");

// ROUTES ==========================================================================================
//let routes = (
//  <Route handler={Body} path="/">
//    <DefaultRoute name="home" handler={Home}/>
//    <Route name="robot-index" handler={RobotIndex}/>
//    <Route name="robot-add" path="add" handler={RobotAdd}/>
//    <Route name="robot-detail" path=":id" handler={RobotDetail}/>
//    <Route name="robot-edit" path=":id/edit" handler={RobotEdit}/>
//    <Route name="about" path="/about" handler={About}/>
//    <NotFoundRoute handler={NotFound}/>
//  </Route>
//);

//window.router = ReactRouter.create({
//  routes: routes,
//  location: HistoryLocation
//});

/*window.router.run((Handler, state) => {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  React.render(<Handler/>, document.body);
});*/

//loadManyAlerts();
//loadManyRobots();

},{"react":"react"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0NBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7Ozs7OztBQU83QixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbi8vbGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbi8vbGV0IHtSb3V0ZSwgRGVmYXVsdFJvdXRlLCBOb3RGb3VuZFJvdXRlLCBIaXN0b3J5TG9jYXRpb259ID0gUmVhY3RSb3V0ZXI7XG5cbi8vIFNoaW1zLCBwb2x5ZmlsbHNcbi8vbGV0IFNoaW1zID0gcmVxdWlyZShcIi4vc2hpbXNcIik7XG5cbmNvbnNvbGUubG9nKFwidGVzdFwiKTtcblxuLy8gQ29tbW9uXG4vL2xldCBCb2R5ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2JvZHlcIik7XG4vL2xldCBIb21lID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hvbWVcIik7XG4vL2xldCBBYm91dCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9hYm91dFwiKTtcbi8vbGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kXCIpO1xuXG4vLyBBbGVydFxuLy9sZXQgbG9hZE1hbnlBbGVydHMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9sb2FkbWFueVwiKTtcblxuLy8gUm9ib3Rcbi8vbGV0IGxvYWRNYW55Um9ib3RzID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvbG9hZG1hbnlcIik7XG4vL2xldCBSb2JvdEluZGV4ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXhcIik7XG4vL2xldCBSb2JvdEFkZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2FkZFwiKTtcbi8vbGV0IFJvYm90RGV0YWlsID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsXCIpO1xuLy9sZXQgUm9ib3RFZGl0ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdFwiKTtcblxuLy8gUk9VVEVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9sZXQgcm91dGVzID0gKFxuLy8gIDxSb3V0ZSBoYW5kbGVyPXtCb2R5fSBwYXRoPVwiL1wiPlxuLy8gICAgPERlZmF1bHRSb3V0ZSBuYW1lPVwiaG9tZVwiIGhhbmRsZXI9e0hvbWV9Lz5cbi8vICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtaW5kZXhcIiBoYW5kbGVyPXtSb2JvdEluZGV4fS8+XG4vLyAgICA8Um91dGUgbmFtZT1cInJvYm90LWFkZFwiIHBhdGg9XCJhZGRcIiBoYW5kbGVyPXtSb2JvdEFkZH0vPlxuLy8gICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1kZXRhaWxcIiBwYXRoPVwiOmlkXCIgaGFuZGxlcj17Um9ib3REZXRhaWx9Lz5cbi8vICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtZWRpdFwiIHBhdGg9XCI6aWQvZWRpdFwiIGhhbmRsZXI9e1JvYm90RWRpdH0vPlxuLy8gICAgPFJvdXRlIG5hbWU9XCJhYm91dFwiIHBhdGg9XCIvYWJvdXRcIiBoYW5kbGVyPXtBYm91dH0vPlxuLy8gICAgPE5vdEZvdW5kUm91dGUgaGFuZGxlcj17Tm90Rm91bmR9Lz5cbi8vICA8L1JvdXRlPlxuLy8pO1xuXG4vL3dpbmRvdy5yb3V0ZXIgPSBSZWFjdFJvdXRlci5jcmVhdGUoe1xuLy8gIHJvdXRlczogcm91dGVzLFxuLy8gIGxvY2F0aW9uOiBIaXN0b3J5TG9jYXRpb25cbi8vfSk7XG5cbi8qd2luZG93LnJvdXRlci5ydW4oKEhhbmRsZXIsIHN0YXRlKSA9PiB7XG4gIC8vIHlvdSBtaWdodCB3YW50IHRvIHB1c2ggdGhlIHN0YXRlIG9mIHRoZSByb3V0ZXIgdG8gYVxuICAvLyBzdG9yZSBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gIC8vIFJvdXRlckFjdGlvbnMucm91dGVDaGFuZ2Uoe3JvdXRlclN0YXRlOiBzdGF0ZX0pO1xuXG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pOyovXG5cbi8vbG9hZE1hbnlBbGVydHMoKTtcbi8vbG9hZE1hbnlSb2JvdHMoKTsiXX0=
