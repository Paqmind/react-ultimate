// IMPORTS =========================================================================================
import {mergeDeep} from "shared/helpers/common";
import state from "frontend/state";

// PROXY ROUTER TO REMOVE CIRCULAR DEPENDENCY ======================================================
// Turns:
//   app (router) <- routes <- components <- actions <- app (router)
// to:
//   app (router) <- routes <- components <- actions <- proxy (router)
let router = {
  makePath(route=undefined, params=undefined, query=undefined) {
    let urlCursor = state.select("url");
    let urlRoute = urlCursor.get("route");
    return window._router.makePath(route || urlRoute, params, query);
  },

  makeHref(route=undefined, params=undefined, query=undefined) {
    let urlCursor = state.select("url");
    return window._router.makeHref(route || urlRoute, params, query);
  },

  transitionTo(route=undefined, params=undefined, query=undefined) {
    let urlCursor = state.select("url");
    window._router.transitionTo(route || urlRoute, params, query);
  },

  replaceWith(route=undefined, params=undefined, query=undefined) {
    let urlCursor = state.select("url");
    window._router.replaceWith(route || urlRoute, params, query);
  },

  goBack() {
    window._router.goBack();
  },

  run(render) {
    window._router.run(render);
  }
};

let modelRouter = {
  makePath(route=undefined, id=undefined) {
    let urlCursor = state.select("url");
    let urlRoute = urlCursor.get("route");
    let urlParams = urlCursor.get("params");
    return window._router.makePath(route || urlRoute, id ? {id} : urlParams);
  },

  makeHref(route=undefined, id=undefined) {
    let urlCursor = state.select("url");
    let urlRoute = urlCursor.get("route");
    let urlParams = urlCursor.get("params");
    return window._router.makeHref(route || urlRoute, id ? {id} : urlParams);
  },

  transitionTo(route=undefined, id=undefined) {
    let urlCursor = state.select("url");
    let urlRoute = urlCursor.get("route");
    let urlParams = urlCursor.get("params");
    window._router.transitionTo(route || urlRoute, id ? {id} : urlParams);
  },

  replaceWith(route=undefined, id=undefined) {
    let urlCursor = state.select("url");
    let urlRoute = urlCursor.get("route");
    let urlParams = urlCursor.get("params");
    window._router.replaceWith(route || urlRoute, id ? {id} : urlParams);
  },

  goBack() {
    window._router.goBack();
  },

  run(render) {
    window._router.run(render);
  }
};

let indexRouter = {
  makePath(route=undefined, query={}) {
    let urlCursor = state.select("url");
    let urlRoute = urlCursor.get("route");
    return window._router.makePath(route || urlRoute, undefined, mergeDeep(urlQuery));
  },

  makeHref(route=undefined, query={}) {
    let urlCursor = state.select("url");
    let urlRoute = urlCursor.get("route");
    return window._router.makeHref(route || urlRoute, undefined, mergeDeep(urlQuery, query));
  },

  transitionTo(route=undefined, query={}) {
    let urlCursor = state.select("url");
    let urlRoute = urlCursor.get("route");
    return window._router.transitionTo(route || urlRoute, undefined, mergeDeep(urlQuery, query));
  },

  replaceWith(route=undefined, query={}) {
    let urlCursor = state.select("url");
    let urlRoute = urlCursor.get("route");
    let urlQuery = urlCursor.get("query");
    return window._router.replaceWith(route || urlRoute, undefined, mergeDeep(urlQuery, query));
  },

  goBack() {
    window._router.goBack();
  },

  run(render) {
    window._router.run(render);
  }
};

export default {
  router,
  modelRouter,
  indexRouter,
};
