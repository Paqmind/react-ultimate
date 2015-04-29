// IMPORTS =========================================================================================
import Axios from "axios";

import state from "frontend/common/state";
import router from "frontend/common/router";
import commonActions from "frontend/common/actions";

// ACTIONS =========================================================================================
export default function remove(id) {
  let oldModel = state.select("robots", "models", id).get();
  let url = `/api/robots/${id}`;

  // Optimistic remove
  state.select("robots", "loading").set(true);
  state.select("robots", "models").unset(id);

  return Axios.delete(url)
    .then(response => {
      state.select("robots").merge({
        loading: false,
        loadError: loadError,
      });
      router.transitionTo("robot-index");
      commonActions.alert.add({message: "Action `Robot.remove` succeed", category: "success"});
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
        state.select("robots", "models", id).set(oldModel); // Cancel remove
        commonActions.alert.add({message: "Action `Robot.remove` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    })
    .done();

  /* Async-Await style. Wait for proper IDE support
  // Optimistic remove
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
