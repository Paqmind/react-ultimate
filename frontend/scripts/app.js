// IMPORTS =========================================================================================
let React = require("react");
let {create: createRouter, HistoryLocation} = require("react-router");

require("shared/shims");
let routes = require("frontend/routes");

// APP =============================================================================================
let router = createRouter({
  routes: routes,
  location: HistoryLocation
});

router.run((Application, state) => {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  let promises = state.routes
    .filter(route => route.handler.fetchData)
    .map(route => route.handler.fetchData(state.params, state.query));

  Promise.all(promises).then(() => {
    React.render(<Application/>, document.getElementById("main"));
  });
});