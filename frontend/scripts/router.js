// IMPORTS =========================================================================================
import {mergeDeep} from "shared/helpers/common";
import {formatQuery} from "shared/helpers/jsonapi";
import state from "frontend/state";

// PROXY ROUTERS TO REMOVE CIRCULAR DEPENDENCY =====================================================
// Turns:
//   app (router) <- routes <- components <- actions <- app (router)
// to:
//   app (router) <- routes <- components <- actions <- proxy (router)
export const router = {
  makePath(route=undefined, params=undefined, query=undefined) {
    route = getCurrentRoute(route);
    return window._router.makePath(route, params, query);
  },

  makeHref(route=undefined, params=undefined, query=undefined) {
    route = getCurrentRoute(route);
    return window._router.makeHref(route, params, query);
  },

  transitionTo(route=undefined, params=undefined, query=undefined) {
    route = getCurrentRoute(route);
    window._router.transitionTo(route, params, query);
  },

  replaceWith(route=undefined, params=undefined, query=undefined) {
    route = getCurrentRoute(route);
    window._router.replaceWith(route, params, query);
  },

  goBack() {
    window._router.goBack();
  },

  run(render) {
    window._router.run(render);
  }
};

export const modelRouter = {
  makePath(route=undefined, id=undefined) {
    let [_route, _params] = getCurrentRouteAndParams(route);
    return window._router.makePath(_route, _params);
  },

  makeHref(route=undefined, id=undefined) {
    let [_route, _params] = getCurrentRouteAndParams(route);
    return window._router.makeHref(route, _params);
  },

  transitionTo(route=undefined, id=undefined) {
    let [_route, _params] = getCurrentRouteAndParams(route);
    window._router.transitionTo(_route, _params);
  },

  replaceWith(route=undefined, id=undefined) {
    let [_route, _params] = getCurrentRouteAndParams(route);
    window._router.replaceWith(_route, _params);
  },

  goBack() {
    window._router.goBack();
  },

  run(render) {
    window._router.run(render);
  }
};

export const indexRouter = {
  makePath(route=undefined, query={}) {
    let [_route, _query] = getCurrentRouteAndQuery(route, query);
    return window._router.makePath(_route, undefined, _query);
  },

  makeHref(route=undefined, query={}) {
    let [_route, _query] = getCurrentRouteAndQuery(route, query);
    return window._router.makeHref(_route, undefined, _query);
  },

  transitionTo(route=undefined, query={}) {
    let [_route, _query] = getCurrentRouteAndQuery(route, query);
    return window._router.transitionTo(_route, undefined, _query);
  },

  replaceWith(route=undefined, query={}) {
    let [_route, _query] = getCurrentRouteAndQuery(route, query);
    return window._router.replaceWith(_route, undefined, _query);
  },

  goBack() {
    window._router.goBack();
  },

  run(render) {
    window._router.run(render);
  }
};

// HELPERS =========================================================================================
function getCurrentRoute(route) {
  let urlCursor = state.select("url");
  let urlRoute = urlCursor.get("route");
  return route || urlRoute;
}

function getCurrentRouteAndParams(route, id) {
  let urlCursor = state.select("url");
  let urlRoute = urlCursor.get("route");
  let urlParams = urlCursor.get("params");
  return [route || urlRoute,  id ? {id} : urlParams];
}

function getCurrentRouteAndQuery(route, query) {
  let urlCursor = state.select("url");
  let urlRoute = urlCursor.get("route");
  let urlQuery = urlCursor.get("query");
  return [route || urlRoute, mergeDeep(urlQuery, formatQuery(query))];
}