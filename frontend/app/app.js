// SHIMS ===========================================================================================
Object.assign = require("object-assign");

Promise.prototype.done = function(onFulfilled, onRejected) {
  this
    .then(onFulfilled, onRejected)
    .catch(function(e) {
      setTimeout(function() { throw e; }, 1);
    });
};

// IMPORTS =========================================================================================
let React = require("react");
let Router = require("./router");
let RobotStore = require("./robot/stores/robots");

// MAIN ============================================================================================
Router.run(function(Handler, state) {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  React.render(<Handler/>, document.body);
});

