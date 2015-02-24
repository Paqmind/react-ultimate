// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Link, RouteHandler} = ReactRouter;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
let About = React.createClass({
  render() {
    return (
      <DocumentTitle title="About">
        <section className="container page info">
          <h1>Simple Page Example</h1>
          <p>This page was rendered by a JavaScript</p>
        </section>
      </DocumentTitle>
    );
  }
});

export default About;
