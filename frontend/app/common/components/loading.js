// IMPORTS =========================================================================================
let React = require("react");
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
let Loading = React.createClass({
  render() {
    return (
      <DocumentTitle title="Loading...">
        <div>
          <section className="container">
            ...
          </section>
        </div>
      </DocumentTitle>
    );
  }
});

export default Loading;
