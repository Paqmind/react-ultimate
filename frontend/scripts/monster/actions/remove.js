// IMPORTS =========================================================================================
import Axios from "axios";
import state from "frontend/state";
import router from "frontend/router";
import commonActions from "frontend/actions";

// ACTIONS =========================================================================================
export default function remove(id) {
  let oldModel = state.select("monsters", "models", id).get();
  let url = `/api/monsters/${id}`;

  // Optimistic remove
  state.select("monsters", "loading").set(true);
  state.select("monsters", "models").unset(id);

  return Axios.delete(url)
    .then(response => {
      state.select("monsters").merge({
        loading: false,
        loadError: loadError,
      });
      router.transitionTo("monster-index");
      commonActions.alert.add({message: "Action `Monster.remove` succeed", category: "success"});
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
        state.select("monsters").merge({loading: false, loadError});
        state.select("monsters", "models", id).set(oldModel); // Cancel remove
        commonActions.alert.add({message: "Action `Monster.remove` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    })
    .done();

  /* Async-Await style. Wait for proper IDE support
  // Optimistic remove
  ...

  let response = {data: []};
  try {
    response = await Axios.put(`/api/monsters/${id}`, newModel);
  } catch (response) {
    ...
  } // else
    ...
  */
}
