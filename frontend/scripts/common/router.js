// IMPORTS =========================================================================================
import state from "frontend/common/state";

// PROXY ROUTER TO REMOVE CIRCULAR DEPENDENCY ======================================================
// Turns:
//   app (router) <- routes <- components <- actions <- app (router)
// to:
//   app (router) <- routes <- components <- actions <- proxy (router)
let proxy = {
  makePath(route=undefined, params=undefined, query=undefined) {
    let cursor = state.select("url");
    return window._router.makePath(
      route || cursor.get("route"),
      params || cursor.get("params"),
      query || cursor.get("query")
    );
  },

  makeHref(route=undefined, params=undefined, query=undefined) {
    let cursor = state.select("url");
    return window._router.makeHref(
      route || cursor.get("route"),
      params || cursor.get("params"),
      query || cursor.get("query")
    );
  },

  transitionTo(route=undefined, params=undefined, query=undefined) {
    let cursor = state.select("url");
    window._router.transitionTo(
      route || cursor.get("route"),
      params || cursor.get("params"),
      query || cursor.get("query")
    );
  },

  replaceWith(route=undefined, params=undefined, query=undefined) {
    let cursor = state.select("url");
    window._router.replaceWith(
      route || cursor.get("route"),
      params || cursor.get("params"),
      query || cursor.get("query")
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


