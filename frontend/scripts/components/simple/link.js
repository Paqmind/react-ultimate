// IMPORTS =========================================================================================
import React from "react";
import ReactRouter from "react-router";
import state from "frontend/state";
import {mergeDeep} from "shared/helpers/common";
import {Component} from "./component";

// COMPONENTS ======================================================================================
export default class Link extends Component {
  render() {
    let urlCursor = state.select("url");

    let props = this.props;
    let params = {}, query = {};
    let withParams, withQuery;

    if (props.withParams) {
      params = mergeDeep(urlCursor.get("params"), props.withParams);
      ({withParams, ...props} = props); // remove "withParams" property... oh man I know this is ugly :(
    }
    if (props.withQuery) {
      query = mergeDeep(urlCursor.get("query"), props.withQuery);
      ({withQuery, ...props} = props); // remove "withQuery" property... no other way to do this: props can't be cloned
    }

    return (
      <ReactRouter.Link params={params} query={query} {...props}>
        {this.props.children}
      </ReactRouter.Link>
    );
  }
}