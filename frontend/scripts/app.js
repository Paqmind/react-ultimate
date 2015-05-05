// IMPORTS =========================================================================================
import "shared/shims";
import React from "react";
import {create as createRouter, HistoryLocation} from "react-router";
import {normalize} from "shared/helpers/common";
import {parseQuery} from "shared/helpers/jsonapi";
import state from "frontend/state";
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

  console.debug("router.run()");

  // SET BAOBAB URL DATA ---------------------------------------------------------------------------
  let urlCursor = state.select("url");
  let handler = url.routes.slice(-1)[0].name;
  let params = normalize(url.params);
  let query = normalize(url.query);
  let reset;
  if (query.reset) {
    reset = true;
    delete query.reset;
  }

  urlCursor.set("handler", handler);
  urlCursor.set("route", url.routes.slice(-1)[0].name);
  urlCursor.set("params", params);
  urlCursor.set("query", query);
  urlCursor.set("reset", reset);

  let id = url.params.id;
  urlCursor.set("id", id);

  let parsedQuery = parseQuery(query);
  urlCursor.set("filters", parsedQuery.filters);
  urlCursor.set("sorts", parsedQuery.sorts);
  urlCursor.set("offset", parsedQuery.offset);
  urlCursor.set("limit", parsedQuery.limit);
  urlCursor.set("limit", parsedQuery.limit);

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
    React.render(<Application/>, document.getElementById("app"));
  });
});
