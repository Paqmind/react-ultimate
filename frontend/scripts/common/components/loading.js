// IMPORTS =========================================================================================
let React = require("react");
let DocumentTitle = require("react-document-title");
let Component = require("frontend/component");

// EXPORTS =========================================================================================
export default class Loading extends Component {
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
}
