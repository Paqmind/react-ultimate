// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {HistoryLocation} = ReactRouter;

require("shared/shims");
let routes = require("frontend/common/routes");
let loadManyAlerts = require("frontend/alert/actions/loadmany");
let loadManyRobots = require("frontend/robot/actions/loadmany");

// APP =============================================================================================
let router = ReactRouter.create({
  routes: routes,
  location: HistoryLocation
});

router.run((Application, state) => {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  React.render(<Application/>, document.getElementById("main"));
});

loadManyAlerts();
loadManyRobots();
