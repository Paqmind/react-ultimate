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
  componentDidMount: function componentDidMount() {
    console.debug("NotFound.componentDidMount");
  },

  render: function render() {
    console.debug("NotFound.render");
    return React.createElement(
      DocumentTitle,
      { title: "Not Found" },
      React.createElement(
        "p",
        null,
        "Not Found"
      )
    );
  }
});