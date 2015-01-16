"use strict";

var React = require("react"),
    Router = require("react-router");

var Home = React.createClass({
  displayName: "Home",
  render: function () {
    console.log(this.props.params);
    return React.createElement(
      "p",
      null,
      "Home"
    );
  }
});

var RobotsIndex = React.createClass({
  displayName: "RobotsIndex",
  mixins: [Router.State],
  render: function () {
    console.log("RobotIndex renders...");
    console.log(this.getParams());
    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "Robots +"
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
    );
  }
});

var RobotsDetail = React.createClass({
  displayName: "RobotsDetail",
  mixins: [Router.State],
  render: function () {
    console.log("RobotDetail renders...");
    console.log(this.getParams());
    return React.createElement(
      "p",
      null,
      "Robot Detail ",
      this.getParams().id
    );
  }
});

var About = React.createClass({
  displayName: "About",
  render: function () {
    console.log(this.props.params);
    return React.createElement(
      "p",
      null,
      "About"
    );
  }
});

var NotFound = React.createClass({
  displayName: "NotFound",
  render: function () {
    console.log(this.props.params);
    return React.createElement(
      "p",
      null,
      "Not Found"
    );
  }
});

var App = React.createClass({
  displayName: "App",
  render: function () {
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

exports.Home = Home;
exports.RobotsIndex = RobotsIndex;
exports.RobotsAbout = RobotsAbout;
exports.NotFound = NotFound;
exports.App = App;