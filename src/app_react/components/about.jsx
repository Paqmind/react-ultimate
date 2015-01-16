// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  componentDidMount() {
    console.debug("About.componentDidMount");
  },

  render() {
    console.debug("About.render");
    return (
      <DocumentTitle title="About">
        <section className="page info">
          <h2>Simple Page Example</h2>
          <p>This page was rendered by a JavaScript</p>
        </section>
      </DocumentTitle>
    );
  }
});

//seoTitle: "Info SEO title",
