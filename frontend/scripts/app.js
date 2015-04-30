// IMPORTS =========================================================================================
import "babel/polyfill";
import "shared/shims";

import React from "react";
import {create as createRouter, HistoryLocation} from "react-router";

import {normalize, parseJsonApiQuery} from "shared/common/helpers";
import state from "frontend/common/state";
import routes from "frontend/routes";

// APP =============================================================================================
window._router = createRouter({
  routes: routes,
  location: HistoryLocation
});

window._router.run((Application, url) => {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  console.debug("router.run");

  // SET BAOBAB URL DATA ---------------------------------------------------------------------------
  let urlCursor = state.select("url");
  let handler = url.routes.slice(-1)[0].name;
  let params = normalize(url.params);
  let query = normalize(url.query);

  urlCursor.set("handler", handler);
  urlCursor.set("route", url.routes.slice(-1)[0].name);
  urlCursor.set("params", params);
  urlCursor.set("query", query);

  let id = url.params.id;
  if (id) {
    urlCursor.set("id", id);
  }

  let parsedQuery = parseJsonApiQuery(query);
  if (parsedQuery.hasOwnProperty("filters")) {
    urlCursor.set("filters", parsedQuery.filters);
  }
  if (parsedQuery.hasOwnProperty("sorts")) {
    urlCursor.set("sorts", parsedQuery.sorts);
  }
  if (parsedQuery.hasOwnProperty("offset")) {
    urlCursor.set("offset", parsedQuery.offset);
  }
  if (parsedQuery.hasOwnProperty("limit")) {
    urlCursor.set("limit", parsedQuery.limit);
  }

  state.commit();
  //------------------------------------------------------------------------------------------------

  let promises = url.routes
    .map(route => route.handler.original || {})
    .map(original => {
      if (original.loadData) {
        original.loadData();
      }
    });

  Promise.all(promises).then(() => {
    React.render(<Application/>, document.getElementById("main"));
  });
});