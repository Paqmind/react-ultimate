// IMPORTS =========================================================================================
import Class from "classnames";
import React from "react";
import DocumentTitle from "react-document-title";
import {Component} from "frontend/scripts/components/component";

// EXPORTS =========================================================================================
export default class Loading extends Component {
  static propTypes = {
    size: React.PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  }

  static defaultProps = {
    size: "md",
  }

  render() {
    return (
      <DocumentTitle title="Loading...">
        <div className={Class("alert-as-icon", "loading-" + this.props.size)}>
          <i className="fa fa-cog fa-spin"></i>
        </div>
      </DocumentTitle>
    );
  }
}
