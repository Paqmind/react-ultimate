// IMPORTS =========================================================================================
import Axios from "axios";
import Robot from "shared/models/robot";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

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
      alertActions.add({message: "Action `Robot.edit` succeed", category: "success"});
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
        alertActions.add({message: "Action `Robot.edit` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    });

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
