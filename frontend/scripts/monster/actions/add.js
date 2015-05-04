// IMPORTS =========================================================================================
import Axios from "axios";
import Monster from "shared/models/monster";
import state from "frontend/state";
import commonActions from "frontend/actions";

// ACTIONS =========================================================================================
export default function add(model) {
  let newModel = Monster(model);
  let id = newModel.id;
  let url = `/api/monsters/${id}`;

  // Optimistic add
  state.select("monsters", "loading").set(true);
  state.select("monsters", "models", id).set(newModel);

  return Axios.put(url, newModel)
    .then(response => {
      state.select("monsters").merge({loading: false, loadError: undefined});
      commonActions.alert.add({message: "Action `Monster.add` succeed", category: "success"});
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
        state.select("monsters", "models").unset(id); // Cancel add
        commonActions.alert.add({message: "Action `Monster.add` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    })
    .done();

  /* Async-Await style. Wait for proper IDE support
  // Optimistic add
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
