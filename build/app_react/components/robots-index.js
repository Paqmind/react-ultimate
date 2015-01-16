"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var Router = require("react-router");
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  displayName: "exports",
  mixins: [Router.State],

  componentDidMount: function componentDidMount() {
    console.debug("RobotsIndex.componentDidMount");
  },

  render: function render() {
    console.debug("RobotsIndex.render", this.getParams());
    return React.createElement(
      DocumentTitle,
      { title: "Robots" },
      React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          "Robots"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            React.createElement(
              Link,
              { to: "robots-detail", params: { id: 1 } },
              "Robot-1"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              Link,
              { to: "robots-detail", params: { id: 2 } },
              "Robot-2"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              Link,
              { to: "robots-detail", params: { id: 3 } },
              "Robot-3"
            )
          )
        ),
        React.createElement(Router.RouteHandler, null)
      )
    );
  }
});