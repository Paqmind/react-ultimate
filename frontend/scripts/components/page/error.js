// IMPORTS =========================================================================================
import Class from "classnames";
import React from "react";
import DocumentTitle from "react-document-title";
import {Component} from "frontend/scripts/components/simple";

// EXPORTS =========================================================================================
export default class Error extends Component {
  static propTypes = {
    loadError: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  }

  static defaultProps = {
    size: "md",
  }

  render() {
    return (
      <DocumentTitle title={"Error " + this.props.loadError.status + ": " + this.props.loadError.description}>
        <div className={Class("alert-as-icon", "fa-stack", {
          [this.props.size]: true
        })}>
          <i className="fa fa-cog fa-stack-1x"></i>
          <i className="fa fa-ban fa-stack-2x"></i>
        </div>
      </DocumentTitle>
    );
  }
}
