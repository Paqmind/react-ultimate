// PROXY ROUTER TO REMOVE CIRCULAR DEPENDENCY ======================================================
// Turns:
//   app (router) <- routes <- components <- actions <- app (router)
// to:
//   app (router) <- routes <- components <- actions <- proxy (router)
let proxy = {
  makePath(to, params, query) {
    return window.router.makePath(to, params, query);
  },

  makeHref(to, params, query) {
    return window.router.makeHref(to, params, query);
  },

  transitionTo(to, params, query) {
    window.router.transitionTo(to, params, query);
  },

  replaceWith(to, params, query) {
    window.router.replaceWith(to, params, query);
  },

  goBack() {
    window.router.goBack();
  },

  run(render) {
    window.router.run(render);
  }
};

export default proxy;
