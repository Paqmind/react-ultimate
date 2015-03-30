// PROXY ROUTER TO SOLVE CIRCULAR DEPENDENCY =======================================================
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
