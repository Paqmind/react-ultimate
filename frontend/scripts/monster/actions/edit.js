// IMPORTS =========================================================================================
import Axios from "axios";
import Monster from "shared/models/monster";
import state from "frontend/state";
import commonActions from "frontend/actions";

// ACTIONS =========================================================================================
export default function edit(model) {
  let newModel = Monster(model);
  let id = newModel.id;
  let oldModel = state.select("monsters", "models", id).get();
  let url = `/api/monsters/${id}`;

  // Optimistic edit
  state.select("monsters", "loading").set(true);
  state.select("monsters", "models", id).set(newModel);

  return Axios.put(url, newModel)
    .then(response => {
      state.select("monsters").merge({
        loading: false,
        loadError: undefined,
      });
      commonActions.alert.add({message: "Action `Monster.edit` succeed", category: "success"});
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
        state.select("monsters", "models", id).set(oldModel); // Cancel edit
        commonActions.alert.add({message: "Action `Monster.edit` failed: " + loadError.description, category: "error"});
        return response.status
      }
    })
    .done();

  /* Async-Await style. Wait for proper IDE support
  // Optimistic edit
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
