// IMPORTS =========================================================================================
import React from "react";
import ReactRouter from "react-router";
import state from "frontend/state";
import {Component} from "./component";

// COMPONENTS ======================================================================================
export default class ModelLink extends Component {
  render() {
    let urlCursor = state.select("url");

    let props = this.props;
    let id = urlCursor.get("id");
    let params = {};

    return (
      <ReactRouter.Link id={id} {...props}>
        {this.props.children}
      </ReactRouter.Link>
    );
  }
}