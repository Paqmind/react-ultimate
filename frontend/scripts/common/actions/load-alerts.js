// IMPORTS =========================================================================================
let Axios = require("axios");

let {toObject} = require("frontend/common/helpers");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export function fetchMany(page, query) {
  let apiURL = `api/alerts`;
  let limit = State.select("robots").get("perpage");
  let offset = (page - 1) * limit;
  let params = {"page[offset]": offset, "page[limit]": limit};

  State.select("alerts").set("loading", false);
  State.select("alerts").set("loadError", undefined);
  State.select("alerts").set("total", 0);
  State.select("alerts").set("models", {});
  return {};
  // TODO: backend
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
  //      State.select("alerts").set("loading", false);
  //      State.select("alerts").set("loadError", loadError);
  //      alert("Action `Alert.loadMany` failed");
  //      return loadError;
  //    }
  //  });
}

export default function loadMany(page, query) {
  // TODO read from cache here
  return fetchMany(page, query);
}
