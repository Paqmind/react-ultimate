// IMPORTS =========================================================================================
let React = require("react");
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
export default React.createClass({
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