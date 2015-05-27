// IMPORTS =========================================================================================
import React from "react";
import DocumentTitle from "react-document-title";
import {Component} from "frontend/scripts/components/simple";

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
