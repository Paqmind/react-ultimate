// IMPORTS =========================================================================================
import React from "react";
import ReactRouter from "react-router";
import state from "frontend/scripts/state";
import {mergeDeep} from "shared/helpers/common";
import {formatQuery} from "shared/helpers/jsonapi";
import {Component} from "./component";

// COMPONENTS ======================================================================================
export class IndexLink extends Component {
  render() {
    let urlCursor = state.select("url");
    let urlQuery = urlCursor.get("query");

    let {query, ...props} = this.props;
    query = mergeDeep(urlQuery, formatQuery(query));

    return (
      <ReactRouter.Link query={query} {...props}>
        {this.props.children}
      </ReactRouter.Link>
    );
  }
}

export class ModelLink extends Component {
  render() {
    let urlCursor = state.select("url");
    let urlId = urlCursor.get("id");

    let {params, ...props} = this.props;
    params = mergeDeep({id: urlId}, params || {});

    return (
      <ReactRouter.Link params={params} {...props}>
        {this.props.children}
      </ReactRouter.Link>
    );
  }
}
