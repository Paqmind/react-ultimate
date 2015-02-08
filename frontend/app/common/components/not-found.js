// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  componentDidMount() {
    console.debug("NotFound.componentDidMount");
  },

  render() {
    console.debug("NotFound.render");
    return (
      <DocumentTitle title="Not Found">
        <div className="container">
          <p>Not Found</p>
        </div>
      </DocumentTitle>
    );
  }
});
