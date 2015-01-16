"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var Router = require("react-router");
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var DocumentTitle = require("react-document-title");
var router = require("../router");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  displayName: "exports",
  mixins: [Router.State, Router.Navigation],

  componentDidMount: function componentDidMount() {
    console.debug("RobotsDetail.componentDidMount");
  },

  onEdit: function onEdit() {
    router.transitionTo("robots-edit", { id: this.getParams().id });
  },

  onRemove: function onRemove() {
    console.debug("RobotsDetail.onRemove");
    console.debug("RobotsDetail.onRemove");
  },

  render: function render() {
    console.debug("RobotsDetail.render", this.getParams());
    return React.createElement(
      DocumentTitle,
      { title: "Robot " + this.getParams().id },
      React.createElement(
        "section",
        null,
        React.createElement(
          "h2",
          null,
          "Robot Detail ",
          this.getParams().id
        ),
        React.createElement("img", { src: "", alt: "", width: "80", height: "80" }),
        React.createElement(
          "div",
          { className: "buttons" },
          React.createElement(
            "a",
            { className: "btn", href: "", onClick: this.onEdit },
            "Edit"
          ),
          React.createElement(
            "button",
            { className: "btn", onClick: this.onRemove },
            "Remove"
          )
        )
      )
    );
  }
});