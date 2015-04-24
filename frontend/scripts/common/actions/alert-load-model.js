// IMPORTS =========================================================================================
let Axios = require("axios");

let {toObject} = require("frontend/common/helpers");
let state = require("frontend/state");

// ACTIONS =========================================================================================
export function fetchModel(id) {
  let apiURL = `/api/alerts/${id}`;

  // Mock API request
  state.select("robots", "loading").set(false);
  return Promise.resolve(200); // HTTP response.status
}

export default function loadModel(id) {
  let model = state.select("alerts", "models").get(id);
  if (model) {
    return model;
  } else {
    return fetchModel(id);
  }
}