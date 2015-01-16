"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var Router = require("react-router");
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;


// EXPORTS =========================================================================================
module.exports = React.createClass({
  displayName: "exports",
  componentDidMount: function componentDidMount() {
    console.debug("Body.componentDidMount");
  },

  render: function render() {
    console.debug("Body.render");
    return React.createElement(
      "div",
      null,
      React.createElement(
        "header",
        null,
        React.createElement(
          "nav",
          { className: "navbar navbar-default" },
          React.createElement(
            "div",
            { className: "container" },
            React.createElement(
              "div",
              { className: "navbar-header" },
              React.createElement(
                "a",
                { className: "navbar-brand", href: "#" },
                "Dashboard"
              )
            ),
            React.createElement(
              "ul",
              { className: "nav navbar-nav" },
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
          )
        )
      ),
      React.createElement(
        "main",
        { className: "container" },
        React.createElement(RouteHandler, null)
      )
    );
  }
});