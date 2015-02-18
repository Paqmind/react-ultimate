// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
let About = React.createClass({
  componentDidMount() {
    console.debug("About.componentDidMount");
  },

  componentWillUnmount() {
    console.debug("About.componentWillUnmount");
  },

  render() {
    console.debug("About.render");
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
