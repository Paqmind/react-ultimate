// IMPORTS =========================================================================================
import {clone, merge} from "ramda";
import React from "react";
import ReactRouter from "react-router";
import state from "frontend/state";
import {Component} from "./component";

// COMPONENTS ======================================================================================
export default class Link extends Component {
  render() {
    let urlCursor = state.select("url");

    let props = Object.assign({}, this.props);
    if (props.withParams) {
      props.params = merge(urlCursor.get("params"), props.withParams);
      delete props.withParams;
    }
    if (props.withQuery) {
      props.query = merge(urlCursor.get("query"), props.withQuery);
      delete props.withQuery;
    }

    return (
      <ReactRouter.Link {...props}>
        {this.props.children}
      </ReactRouter.Link>
    );
  }
}