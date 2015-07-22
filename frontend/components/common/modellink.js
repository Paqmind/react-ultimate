import React from "react";
import ReactRouter from "react-router";
import state from "frontend/state";
import {merge} from "shared/helpers/common";
import {formatQuery} from "shared/helpers/jsonapi";
import {Component} from "./component";

// CURSORS =========================================================================================
let $url = state.select("url");

// COMPONENTS ======================================================================================
export default class ModelLink extends Component {
  render() {
    let {params, ...props} = this.props;
    params = merge(params || {}, $url.get("params"));

    return (
      <ReactRouter.Link params={params} {...props}>
        {this.props.children}
      </ReactRouter.Link>
    );
  }
}
