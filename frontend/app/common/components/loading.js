// IMPORTS =========================================================================================
let React = require("react");
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
let Loading = React.createClass({
  render() {
    let sizeClass = this.props.size ? ' loading-' + this.props.size : '';
    return (
      <DocumentTitle title="Loading...">
        <div className={"loading" + sizeClass}>
          <i className="fa fa-cog fa-spin"></i>
        </div>
      </DocumentTitle>
    );
  }
});

export default Loading;
