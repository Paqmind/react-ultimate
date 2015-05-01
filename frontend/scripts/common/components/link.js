// IMPORTS =========================================================================================
import merge from "lodash.merge";
import React from "react";
import ReactRouter from "react-router";

import Component from "frontend/common/component";
import state from "frontend/common/state";

// COMPONENTS ======================================================================================
export default class Link extends Component {
  render() {
    let urlCursor = state.select("url");

    let props = Object.assign({}, this.props);
    if (props.withParams) {
      props.params = merge({}, urlCursor.get("params"), props.withParams);
      delete props.withParams;
    }
    if (props.withQuery) {
      props.withQuery = props.withQuery === true ? {} : props.withQuery;
      props.query = merge({}, urlCursor.get("query"), props.withQuery);
      delete props.withQuery;
    }

    return (
      <ReactRouter.Link {...props}>
        {this.props.children}
      </ReactRouter.Link>
    );
  }
}