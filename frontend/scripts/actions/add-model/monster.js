// IMPORTS =========================================================================================
import Axios from "axios";
import Monster from "shared/models/monster";
import {recalculatePaginationWithModel} from "frontend/helpers/pagination";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// ACTIONS =========================================================================================
export default function add(model) {
  let cursor = state.select("monsters");

  let oldModels = cursor.get("models");
  let oldPagination = cursor.get("pagination");
  let newModel = Monster(model);
  let id = newModel.id;
  let newPagination = recalculatePaginationWithModel(id, oldPagination, oldModels);
  let url = `/api/monsters/${id}`;

  // Optimistic action
  cursor.set("loading", true);
  cursor.set("pagination", newPagination);
  cursor.select("models").set(id, newModel);

  return Axios.put(url, newModel)
    .then(response => {
      cursor.merge({loading: false, loadError: undefined});

      // Add alert
      alertActions.add({message: "Action succeed", category: "success"});

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
        cursor.select("models").unset(id);
        cursor.set("pagination", oldPagination);

        // Add alert
        alertActions.add({message: "Action failed: " + loadError.description, category: "error"});

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
