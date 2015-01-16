"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var router = require("./router");

// MAIN ============================================================================================
router.run(function (Handler, state) {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  React.render(React.createElement(Handler, null), document.body);
});