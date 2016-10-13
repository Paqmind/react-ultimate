import React from "react"
import ReactRouter from "react-router"
import state from "frontend/state"
import {merge} from "common/helpers/common"
import {formatQuery} from "common/helpers/jsonapi"
import {Component} from "./component"

let urlCursor = state.select("url")

export default class ItemLink extends Component {
  render() {
    let {params, ...props} = this.props
    params = merge(urlCursor.get("params"), params || {})

    return (
      <ReactRouter.Link params={params} {...props}>
        {this.props.children}
      </ReactRouter.Link>
    )
  }
}
