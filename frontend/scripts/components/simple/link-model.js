// IMPORTS =========================================================================================
import React from "react";
import ReactRouter from "react-router";
import state from "frontend/scripts/state";
import {mergeDeep} from "shared/helpers/common";
import {Component} from "./component";

// COMPONENTS ======================================================================================
export default class ModelLink extends Component {
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
