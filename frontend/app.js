// IMPORTS =========================================================================================
let React = require("react");
let Router = require("./router");
let Stores = require("./stores");

// MAIN ============================================================================================
Router.run(function(Handler, state) {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  React.render(<Handler/>, document.body);
});

