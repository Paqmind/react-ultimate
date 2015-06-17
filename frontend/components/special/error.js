import Class from "classnames";
import React from "react";
import DocumentTitle from "react-document-title";
import {Component} from "frontend/components/component";

import "frontend/components/special/gear.less";

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
        <div className={Class("gear", this.props.size, "fa-stack")}>
          <i className="fa fa-cog fa-stack-1x"></i>
          <i className="fa fa-ban fa-stack-2x"></i>
        </div>
      </DocumentTitle>
    );
  }
}
