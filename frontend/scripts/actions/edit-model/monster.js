// IMPORTS =========================================================================================
import Axios from "axios";
import Monster from "shared/models/monster";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// ACTIONS =========================================================================================
export default function edit(model) {
  let newModel = Monster(model);
  let id = newModel.id;
  let url = `/api/monsters/${id}`;

  let cursor = state.select("monsters");
  let total = cursor.get("total");
  let models = cursor.get("models");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let pagination = cursor.get("pagination");

  // Optimistic action
  cursor.set("loading", true);
  cursor.select("models").set(id, newModel);

  return Axios.put(url, newModel)
    .then(response => {
      cursor.merge({loading: false, loadError: undefined});

      // Add alert
      alertActions.addModel({message: "Action `Monster:editModel` succeed", category: "success"});

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

        // Cancel action
        cursor.merge({loading: false, loadError});
        cursor.set("models", models);

        // Add alert
        alertActions.addModel({message: "Action `Monster:editModel` failed: " + loadError.description, category: "error"});

        return response.status;
      }
    });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic action
  ...

  let response = {data: []};
  try {
    response = await Axios.put(url, newModel);
  } catch (response) {
    ...
  } // else
    ...
  */
}
