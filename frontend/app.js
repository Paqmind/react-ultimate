import "babel-polyfill" // TODO: do we need it?
import "common/shims"
import {filter, forEach, keys, map, pipe} from "ramda"
import React, { Component } from "react"
import {create as createRouter, HistoryLocation} from "react-router"
import ReactDOM from "react-dom"
import ReactCSSTransitionGroup from "react-transition-group"
import {parseDefault} from "common/parsers"
import state from "frontend/state"
import * as alertActions from "frontend/actions/alert"
import {processAlertQueue} from "frontend/alerts"
import {processAjaxQueue} from "frontend/ajax"
import routes from "frontend/routes"
import "frontend/less/theme.less"

let urlCursor = state.select("url")

class Application extends Component {
  render() {
    return (
         <main id="app"/>  
    );
  }
}

window._router = createRouter({
  routes: routes,
  location: HistoryLocation
})

window._router.run((Application, url) => {
  let route =  url.routes.slice(-1)[0]

  urlCursor.set("route", route.name)
  urlCursor.set("path", route.path)
  urlCursor.set("params", parseDefault(url.params))
  urlCursor.set("query", parseDefault(url.query))

  pipe(
    filter(route => route.handler.loadData),
    forEach(route => route.handler.loadData())
  )(url.routes)

  ReactDOM.render(<Application/>, document.getElementById("app"))
})

// Request alert index once (TODO this should be realtime with push notifications)
alertActions.fetchIndex()

setImmediate(processAlertQueue)
setImmediate(processAjaxQueue)
