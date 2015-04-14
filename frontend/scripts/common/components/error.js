// IMPORTS =========================================================================================
let Class = require("classnames");
let React = require("react");
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
export default React.createClass({
  propTypes: {
    loadError: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  },

  getDefaultProps() {
    return {
      size: "md",
    }
  },

  render() {
    return (
      <DocumentTitle title={"Error " + this.props.loadError.status + ": " + this.props.loadError.description}>
        <div className={Class({
          "alert-as-icon": true,
          "fa-stack": true,
          [this.props.size]: true
        })}>
          <i className="fa fa-cog fa-stack-1x"></i>
          <i className="fa fa-ban fa-stack-2x"></i>
        </div>
      </DocumentTitle>
    );
  }
});
