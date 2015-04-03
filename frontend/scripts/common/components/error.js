// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Link, RouteHandler} = ReactRouter;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
export default React.createClass({
  render() {
    let sizeClass = this.props.size ? ' loading-' + this.props.size : '';
    return (
      <DocumentTitle title={"Error " + this.props.loadError.status + ": " + this.props.loadError.description}>
        <div className={"alert-as-icon fa-stack" + sizeClass}>
          <i className="fa fa-cog fa-stack-1x"></i>
          <i className="fa fa-ban fa-stack-2x"></i>
        </div>
      </DocumentTitle>
    );
  }
});
