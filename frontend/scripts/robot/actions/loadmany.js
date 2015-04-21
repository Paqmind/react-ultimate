// IMPORTS =========================================================================================
let Axios = require("axios");

let {toObject} = require("frontend/common/helpers");
let CommonActions = require("frontend/common/actions");
let State = require("frontend/state");

// ACTIONS =========================================================================================
export default function loadMany(page, query) {
  let apiURL = `/api/robots/`;
  let limit = State.select("robots").get("perpage");
  let offset = (page - 1) * limit;
  let params = {"page[offset]": offset, "page[limit]": limit};

  State.select("robots").set("loading", true);
  return Axios.get(apiURL, {params})
    .then(response => {
      let {data, meta} = response.data;
      let models = toObject(data);
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", undefined);
      State.select("robots").set("total", meta.page && meta.page.total || Object.keys(models).length);
      State.select("robots").set("models", models);
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
        State.select("robots").set("loading", false);
        State.select("robots").set("loadError", loadError);
        CommonActions.addAlert({message: "Action `Robot.loadMany` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    });
}
