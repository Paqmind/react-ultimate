// IMPORTS =========================================================================================
import Axios from "axios";

import state from "frontend/common/state";
import router from "frontend/common/router";
import commonActions from "frontend/common/actions";
import Robot from "frontend/robot/models";

// ACTIONS =========================================================================================
export default function edit(model) {
  let newModel = Robot(model);
  let id = newModel.id;
  let oldModel = state.select("robots", "models", id).get();
  let url = `/api/robots/${id}`;

  // Optimistic edit
  state.select("robots", "loading").set(true);
  state.select("robots", "models", id).set(newModel);

  return Axios.put(url, newModel)
    .then(response => {
      state.select("robots").merge({
        loading: false,
        loadError: undefined,
      });
      commonActions.alert.add({message: "Action `Robot.edit` succeed", category: "success"});
      return response.status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let loadError = {
          status: response.status,
          description: response.statusText,
          url: url
        };
        state.select("robots").merge({loading: false, loadError});
        state.select("robots", "models", id).set(oldModel); // Cancel edit
        commonActions.alert.add({message: "Action `Robot.edit` failed: " + loadError.description, category: "error"});
        return response.status
      }
    })
    .done();

  /* Async-Await style. Wait for proper IDE support
  // Optimistic edit
  ...

  let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    ...
  } // else
    ...
  */
}
