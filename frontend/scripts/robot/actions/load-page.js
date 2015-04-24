// IMPORTS =========================================================================================
let Axios = require("axios");

let {toObject, formatJsonApiQuery} = require("frontend/common/helpers");
let commonActions = require("frontend/common/actions");
let state = require("frontend/state");

// ACTIONS =========================================================================================
export function fetchPage(page, perpage, filters, sorts) {
  let apiURL = `/api/robots/`;
  let params = formatJsonApiQuery(page, perpage, filters, sorts);
  state.select("robots", "loading").set(true);
  return Axios.get(apiURL, {params})
    .then(response => {
      // Current state
      let models = state.select("robots", "models").get();
      let pagination = state.select("robots", "pagination").get();

      // New data
      let {data, meta} = response.data;
      let fetchedModels = toObject(data)

      // Update state
      state.select("robots").merge({
        total: meta.page && meta.page.total || Object.keys(models).length,
        models: Object.assign(models, fetchedModels),
        pagination: Object.assign(pagination, {[page]: Object.keys(fetchedModels)}),
        loading: false,
        loadError: false
      });

      return response.status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let loadError = {
          status: response.status,
          description: response.statusText,
          url: apiURL
        };
        state.select("robots").merge({loading: false, loadError});
        state.commit(); // God, this is required just about everwhere! :(
        commonActions.alert.add({message: "Action `Robot:fetchPage` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    })
    .done();
}

export default function loadPage(page, filters, sorts) {
  let pagination = state.select("robots", "pagination").get();
  let perpage = state.select("robots", "perpage").get();
  let ids = pagination[page];
  if (!ids) {
    console.debug("Robots: fetch page", page);
    return fetchPage(page, perpage, filters, sorts);
  }
}
