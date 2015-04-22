// IMPORTS =========================================================================================
let Axios = require("axios");

let {toObject} = require("frontend/common/helpers");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export function fetchOne(id) {
  let apiURL = `/api/alerts/${id}`;

  State.select("robots").set("loading", false);
  // TODO
  //return Axios.get(apiURL)
  //  .then(response => {
  //    let models = toObject(response.data);
  //    State.select("alerts").set("loading", false);
  //    State.select("alerts").set("loadError", undefined);
  //    State.select("alerts").set("models", models);
  //    return models;
  //  })
  //  .catch(response => {
  //    if (response instanceof Error) {
  //      throw response;
  //    } else {
  //      let loadError = {status: response.statusText, url: apiURL};
  //      State.select("robots").set("loading", false);
  //      State.select("robots").set("loadError", loadError);
  //      alert("Action `Alert:fetchOne` failed");
  //      return loadError;
  //    }
  //  });
}

export default function loadOne(id) {
  // TODO read from cache here
  return fetchOne(id);
}