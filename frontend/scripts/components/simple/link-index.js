// IMPORTS =========================================================================================
import React from "react";
import ReactRouter from "react-router";
import state from "frontend/state";
import {mergeDeep} from "shared/helpers/common";
import {Component} from "./component";

// COMPONENTS ======================================================================================
export default class IndexLink extends Component {
  render() {
    let urlCursor = state.select("url");
    let urlQuery = urlCursor.get("query");

    let {query, ...props} = this.props;
    query = mergeDeep(urlQuery, query);

    return (
      <ReactRouter.Link query={query} {...props}>
        {this.props.children}
      </ReactRouter.Link>
    );
  }
}