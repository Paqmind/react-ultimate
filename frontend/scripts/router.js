// IMPORTS =========================================================================================
import {merge} from "ramda";
import state from "frontend/state";

// PROXY ROUTER TO REMOVE CIRCULAR DEPENDENCY ======================================================
// Turns:
//   app (router) <- routes <- components <- actions <- app (router)
// to:
//   app (router) <- routes <- components <- actions <- proxy (router)
let proxy = {
  makePath(route=undefined, params=undefined, query=undefined, withParams=undefined, withQuery=undefined) {
    let urlCursor = state.select("url");
    return window._router.makePath(
      route || urlCursor.get("route"),
      withParams ? merge(urlCursor.get("params"), withParams) : params,
      withQuery  ? merge(urlCursor.get("query"),  withQuery)  : query
    );
  },

  makeHref(route=undefined, params=undefined, query=undefined, withParams=undefined, withQuery=undefined) {
    let urlCursor = state.select("url");
    return window._router.makeHref(
      route || urlCursor.get("route"),
      withParams ? merge(urlCursor.get("params"), withParams) : params,
      withQuery  ? merge(urlCursor.get("query"),  withQuery)  : query
    );
  },

  transitionTo(route=undefined, params=undefined, query=undefined, withParams=undefined, withQuery=undefined) {
    let urlCursor = state.select("url");
    window._router.transitionTo(
      route || urlCursor.get("route"),
      withParams ? merge(urlCursor.get("params"), withParams) : params,
      withQuery  ? merge(urlCursor.get("query"),  withQuery)  : query
    );
  },

  replaceWith(route=undefined, params=undefined, query=undefined, withParams=undefined, withQuery=undefined) {
    let urlCursor = state.select("url");
    window._router.replaceWith(
      route || urlCursor.get("route"),
      withParams ? merge(urlCursor.get("params"), withParams) : params,
      withQuery  ? merge(urlCursor.get("query"),  withQuery)  : query
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
