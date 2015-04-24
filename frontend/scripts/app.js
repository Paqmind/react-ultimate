// IMPORTS =========================================================================================
let React = require("react");
let {create: createRouter, HistoryLocation} = require("react-router");

require("shared/shims");
let {parseJsonApiQuery} = require("frontend/common/helpers");
let routes = require("frontend/routes");
let state = require("frontend/state");

// APP =============================================================================================
window.router = createRouter({
  routes: routes,
  location: HistoryLocation
});

window.router.run((Application, url) => {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  // SET BAOBAB URL DATA ---------------------------------------------------------------------------
  let handler = url.routes.slice(-1)[0].name;
  state.select("url", "handler").set(handler);

  let id = url.params.id;
  if (id) {
    state.select("url", "id").set(id);
  }

  let page = url.params.page && parseInt(url.params.page);
  if (page) {
    state.select("url", "page").set(page);
  }

  let {filters, sorts} = parseJsonApiQuery(url.query);
  if (filters) {
    state.select("url", "filters").set(filters);
  }
  if (sorts) {
    state.select("url", "sorts").set(sorts);
  }

  state.commit();
  //------------------------------------------------------------------------------------------------

  let promises = url.routes
    .map(route => route.handler.original || {})
    .map(original => {
      if (original.loadPage) {
        return original.loadPage(page, filters, sorts);
      } else if (original.loadModel) {
        return original.loadModel(id);
      }
    });

  Promise.all(promises).then(() => {
    React.render(<Application/>, document.getElementById("main"));
  });
});