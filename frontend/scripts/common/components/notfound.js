// IMPORTS =========================================================================================
let React = require("react");
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
export default React.createClass({
  render() {
    return (
      <DocumentTitle title="Not Found">
        <section className="container page">
          <h1>Page not Found</h1>
          <p>Something is wrong</p>
        </section>
      </DocumentTitle>
    );
  }
});