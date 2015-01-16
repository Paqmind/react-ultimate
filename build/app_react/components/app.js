"use strict";

// IMPORTS =========================================================================================
var React = require("react");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  displayName: "exports",
  componentDidMount: function componentDidMount() {
    console.debug("App.componentDidMount");
  },

  render: function render() {
    console.debug("App.render");
    return React.createElement(
      "div",
      null,
      React.createElement(
        "header",
        null,
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            React.createElement(
              Link,
              { to: "home" },
              "Home"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              Link,
              { to: "robots-index" },
              "Robots"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              Link,
              { to: "about" },
              "About"
            )
          )
        )
      ),
      React.createElement(
        "main",
        null,
        React.createElement(Router.RouteHandler, null)
      )
    );
  }
});