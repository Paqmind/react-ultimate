// IMPORTS =========================================================================================
let React = require("react/addons");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
let NotFound = React.createClass({
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

export default NotFound;
