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
    console.debug("About.componentDidMount");
  },

  render: function render() {
    console.debug("About.render");
    return React.createElement(
      DocumentTitle,
      { title: "About" },
      React.createElement(
        "section",
        { className: "page info" },
        React.createElement(
          "h2",
          null,
          "Simple Page Example"
        ),
        React.createElement(
          "p",
          null,
          "This page was rendered by a JavaScript"
        )
      )
    );
  }
});

//seoTitle: "Info SEO title",