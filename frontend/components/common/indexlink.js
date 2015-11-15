import React from "react";
import ReactRouter from "react-router";
import state from "frontend/state";
import {merge} from "shared/helpers/common";
import {formatQuery} from "shared/helpers/jsonapi";
import {Component} from "./component";

let urlCursor = state.select("url");

export default class IndexLink extends Component {
  render() {
    let {query, ...props} = this.props;
    query = merge(formatQuery(query), urlCursor.get("query"));

    return (
      <ReactRouter.Link query={query} {...props}>
        {this.props.children}
      </ReactRouter.Link>
    );
  }
}
