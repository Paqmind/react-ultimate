// IMPORTS =========================================================================================
let React = require("react");
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
export default React.createClass({
  render() {
    let sizeClass = this.props.size ? ' loading-' + this.props.size : '';
    return (
      <DocumentTitle title="Loading...">
        <div className={"alert-as-icon" + sizeClass}>
          <i className="fa fa-cog fa-spin"></i>
        </div>
      </DocumentTitle>
    );
  }
});
