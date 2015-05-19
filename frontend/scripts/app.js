// IMPORTS =========================================================================================
import "babel/polyfill";
import {keys, map, pipe} from "ramda";
import React from "react";
import {create as createRouter, HistoryLocation} from "react-router";
import "shared/shims"; // TODO except for prerender (isomorphic) step, because babel-node auto-injects it's polyfill
import {normalize, flattenArrayObject} from "shared/helpers/common";
import {parseQuery} from "shared/helpers/jsonapi";
import {joiValidate} from "shared/helpers/validation";
import commonValidators from "shared/validators/common";
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

  // Update URL primary state
  urlCursor.set("handler", handler);
  urlCursor.set("route", url.routes.slice(-1)[0].name);
  urlCursor.set("params", params);
  urlCursor.set("query", query);

  let id = url.params.id;
  urlCursor.set("id", id);

  // Parse and validate URL Query
  let parsedQuery = parseQuery(query);
  let [cleanedQuery, errors] = joiValidate(parsedQuery, commonValidators.urlQuery);
  if (keys(errors).length) {
    let humanReadableErrors = flattenArrayObject(errors).join(", ");
    alert(`Invalid URL query params. Errors: ${humanReadableErrors}`);
    throw Error(`Invalid URL query params. Errors: ${humanReadableErrors}`);
  }

  urlCursor.set("filters", cleanedQuery.filters);
  urlCursor.set("sorts", cleanedQuery.sorts);
  urlCursor.set("offset", cleanedQuery.offset);
  urlCursor.set("limit", cleanedQuery.limit);
  //------------------------------------------------------------------------------------------------

  let promises = pipe(
    map(route => route.handler.original || {}),
    map(original => {
      if (original.loadData) {
        return original.loadData();
      }
    })
  )(url.routes);

  Promise.all(promises).then(() => {
    React.render(<Application/>, document.getElementById("app"));
  });
});