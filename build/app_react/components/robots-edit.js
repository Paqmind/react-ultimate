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
    console.debug("RobotsEdit.componentDidMount");
  },

  onDetail: function onDetail() {
    console.debug("RobotsEdit.onEdit");
    this.transitionTo("/xxx", { id: this.getParams().id });
  },

  onRemove: function onRemove() {
    console.debug("RobotsEdit.onRemove");
  },

  render: function render() {
    console.debug("RobotsEdit.render", this.getParams());
    return React.createElement(
      DocumentTitle,
      { title: "Edit robot " + this.getParams().id },
      React.createElement(
        "section",
        null,
        React.createElement(
          "h2",
          null,
          "Robot Edit ",
          this.getParams().id
        ),
        React.createElement(
          "p",
          null,
          "This form and all behavior is defined by the form view in ",
          React.createElement(
            "code",
            null,
            "client/forms/person.js"
          ),
          "."
        ),
        React.createElement(
          "p",
          null,
          "The same form-view is used for both editing and creating new users."
        ),
        React.createElement(
          "form",
          null,
          React.createElement("fieldset", { "data-hook": "field-container" }),
          React.createElement(
            "div",
            { className: "buttons" },
            React.createElement(
              "button",
              { className: "btn", "data-hook": "reset", type: "submit" },
              "Submit"
            )
          )
        )
      )
    );
  }
});