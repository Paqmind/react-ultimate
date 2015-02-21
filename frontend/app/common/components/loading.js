// IMPORTS =========================================================================================
let React = require("react");
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
let Loading = React.createClass({
  render() {
    return (
      <DocumentTitle title="Loading...">
        <div id="loading">
          <i className="fa fa-cog fa-spin"></i>
        </div>
      </DocumentTitle>
    );
  }
});

export default Loading;
