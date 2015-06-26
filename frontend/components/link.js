import React from "react";
import ReactRouter from "react-router";
import state from "frontend/state";
import {merge} from "shared/helpers/common";
import {formatQuery} from "shared/helpers/jsonapi";
import {Component} from "frontend/components/component";

// COMPONENTS ======================================================================================
export class IndexLink extends Component {
  render() {
    let urlCursor = state.select("url");
    let urlQuery = urlCursor.get("query");

    let {query, ...props} = this.props;
    query = merge(formatQuery(query), urlQuery);

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
    params = merge(params || {}, {id: urlId});

    return (
      <ReactRouter.Link params={params} {...props}>
        {this.props.children}
      </ReactRouter.Link>
    );
  }
}
