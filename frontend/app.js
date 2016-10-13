import "babel/polyfill"
import "common/shims"
import {filter, forEach, keys, map, pipe} from "ramda"
import Globalize from "globalize"
import React from "react"
import {create as createRouter, HistoryLocation} from "react-router"
import {parseDefault} from "common/parsers"
import state from "frontend/state"
import * as alertActions from "frontend/actions/alert"
import {processAlertQueue} from "frontend/alerts"
import {processAjaxQueue} from "frontend/ajax"
import routes from "frontend/routes"
import "frontend/less/theme.less"

let urlCursor = state.select("url")

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

  React.render(<Application/>, document.getElementById("app"))
})

// Request alert index once (TODO this should be realtime with push notifications)
alertActions.fetchIndex()

setImmediate(processAlertQueue)
setImmediate(processAjaxQueue)
