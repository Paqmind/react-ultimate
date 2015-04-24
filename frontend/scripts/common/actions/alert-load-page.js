// IMPORTS =========================================================================================
let Axios = require("axios");

let {toObject, formatJsonApiQuery} = require("frontend/common/helpers");
let state = require("frontend/state");

// ACTIONS =========================================================================================
export function fetchPage(page, perpage, filters, sorts) {
  // Mock API request
  let apiURL = `api/alerts`;
  let params = formatJsonApiQuery(page, perpage, filters, sorts);
  state.select("alerts").merge({
    loading: false,
    loadError: undefined,
    total: 0,
    models: {},
  });
  return Promise.resolve(200); // HTTP response.status
}

export default function loadPage(page, filters, sorts) {
  let pagination = state.select("alerts", "pagination").get();
  let perpage = state.select("alerts", "perpage").get();
  let ids = pagination[page];
  if (!ids) {
    return fetchPage(page, perpage, filters, sorts);
  }
}
