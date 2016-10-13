import React from "react"
import ReactRouter from "react-router"
import state from "frontend/state"
import {merge} from "common/helpers/common"
import {formatQuery} from "common/helpers/jsonapi"
import {Component} from "./component"

let urlCursor = state.select("url")

export default class IndexLink extends Component {
  render() {
    let {query, ...props} = this.props
    query = merge(urlCursor.get("query"), formatQuery(query))

    return (
      <ReactRouter.Link query={query} {...props}>
        {this.props.children}
      </ReactRouter.Link>
    )
  }
}
