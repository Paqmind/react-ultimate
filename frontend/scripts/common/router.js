// IMPORTS =========================================================================================
import merge from "lodash.merge";

import state from "frontend/common/state";

// PROXY ROUTER TO REMOVE CIRCULAR DEPENDENCY ======================================================
// Turns:
//   app (router) <- routes <- components <- actions <- app (router)
// to:
//   app (router) <- routes <- components <- actions <- proxy (router)
let proxy = {
  makePath(route=undefined, params=undefined, query=undefined, withParams={}, withQuery={}) {
    let cursor = state.select("url");
    return window._router.makePath(
      route || cursor.get("route"),
      merge({}, params || cursor.get("params"), withParams),
      merge({}, query || cursor.get("query"), withQuery)
    );
  },

  makeHref(route=undefined, params=undefined, query=undefined, withParams={}, withQuery={}) {
    let cursor = state.select("url");
    return window._router.makeHref(
      route || cursor.get("route"),
      merge({}, params || cursor.get("params"), withParams),
      merge({}, query || cursor.get("query"), withQuery)
    );
  },

  transitionTo(route=undefined, params=undefined, query=undefined, withParams={}, withQuery={}) {
    let cursor = state.select("url");
    window._router.transitionTo(
      route || cursor.get("route"),
      merge({}, params || cursor.get("params"), withParams),
      merge({}, query || cursor.get("query"), withQuery)
    );
  },

  replaceWith(route=undefined, params=undefined, query=undefined, withParams={}, withQuery={}) {
    let cursor = state.select("url");
    window._router.replaceWith(
      route || cursor.get("route"),
      merge({}, params || cursor.get("params"), withParams),
      merge({}, query || cursor.get("query"), withQuery)
    );
  },

  goBack() {
    window._router.goBack();
  },

  run(render) {
    window._router.run(render);
  }
};

export default proxy;


