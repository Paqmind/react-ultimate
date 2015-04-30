// IMPORTS =========================================================================================
import "babel/polyfill";
import "shared/shims";

import React from "react";
import {create as createRouter, HistoryLocation} from "react-router";

import {parseJsonApiQuery} from "shared/common/helpers";
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
  urlCursor.set("handler", handler);
  urlCursor.set("params", url.params);
  urlCursor.set("query", url.query);

  let id = url.params.id;
  if (id) {
    urlCursor.set("id", id);
  }

  let {filters, sorts, offset, limit} = parseJsonApiQuery(url.query);
  urlCursor.set("route", url.routes.slice(-1)[0].name);
  if (filters) {
    urlCursor.set("filters", filters);
  }
  if (sorts) {
    urlCursor.set("sorts", sorts);
  }
  if (offset || offset === 0) {
    urlCursor.set("offset", offset);
  }
  if (limit || limit === 0) {
    urlCursor.set("limit", limit);
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