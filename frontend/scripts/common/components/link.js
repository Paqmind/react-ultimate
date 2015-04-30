// IMPORTS =========================================================================================
import merge from "lodash.merge";
import React from "react";
import ReactRouter from "react-router";

import Component from "frontend/common/component";
import state from "frontend/common/state";

// COMPONENTS ======================================================================================
export default class Link extends Component {
  render() {
    let cursor = state.select("url");
    let params = cursor.get("params");
    let query = cursor.get("query");

    let props = Object.assign({}, this.props);
    if (props.hasOwnProperty("withParams")) {
      props.withParams = props.withParams === true ? {} : props.withParams;
      props.params = merge({}, params, props.withParams);
      delete props.withParams;
    }
    if (props.hasOwnProperty("withQuery")) {
      props.withQuery = props.withQuery === true ? {} : props.withQuery;
      props.query = merge({}, query, props.withQuery);
      delete props.withQuery;
    }

    return <ReactRouter.Link {...props}>
      {this.props.children}
    </ReactRouter.Link>;
  }
}