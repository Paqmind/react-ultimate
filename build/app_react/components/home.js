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
    console.debug("Home.componentDidMount");
  },

  render: function render() {
    console.debug("Home.render");
    return React.createElement(
      DocumentTitle,
      { title: "Home" },
      React.createElement(
        "section",
        { className: "page home" },
        React.createElement(
          "h2",
          null,
          "Welcome to a Robots Demo App"
        ),
        React.createElement(
          "p",
          null,
          "If you \"view source\" you'll see it's 100% client rendered"
        ),
        React.createElement(
          "p",
          null,
          "Click around the site using the nav bar at the top"
        ),
        React.createElement(
          "p",
          null,
          "Things to note:"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "The url changes, no requests are made to the server"
          ),
          React.createElement(
            "li",
            null,
            "Refreshing the page will always get you back to the same page"
          ),
          React.createElement(
            "li",
            null,
            "Page changes are nearly instantaneous"
          ),
          React.createElement(
            "li",
            null,
            "In development mode, you don't need to restart the server to see changes, just edit and refresh"
          ),
          React.createElement(
            "li",
            null,
            "In production mode, it will serve minfied, uniquely named files with super agressive cache headers. To test:",
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                "in dev_config.json set ",
                React.createElement(
                  "code",
                  null,
                  "isDev"
                ),
                " to ",
                React.createElement(
                  "code",
                  null,
                  "false"
                )
              ),
              React.createElement(
                "li",
                null,
                "restart the server"
              ),
              React.createElement(
                "li",
                null,
                "view source and you'll see minified css and js files with unique names"
              ),
              React.createElement(
                "li",
                null,
                "open the \"network\" tab in chrome dev tools (or something similar). You'll also want to make sure you haven't disabled your cache"
              ),
              React.createElement(
                "li",
                null,
                "without hitting \"refresh\" load the app again (selecting current URL in url bar and hitting \"enter\" works great)"
              ),
              React.createElement(
                "li",
                null,
                "you should now see that the JS and CSS files were both served from cache without making any request to the server at all"
              )
            )
          )
        )
      )
    );
  }
});

//seoTitle: "Home SEO title",