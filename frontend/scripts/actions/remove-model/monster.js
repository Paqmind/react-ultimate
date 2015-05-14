// IMPORTS =========================================================================================
import Axios from "axios";
import {recalculatePaginationWithoutModel} from "frontend/helpers/pagination";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// ACTIONS =========================================================================================
export default function remove(id) {
  let cursor = state.select("monsters");

  let oldTotal = cursor.get("total");
  let oldPagination = cursor.get("pagination");
  let oldModel = state.select("monsters", "models", id).get();
  let newPagination = recalculatePaginationWithoutModel(id, oldPagination);
  let url = `/api/monsters/${id}`;

  // Optimistic action
  cursor.set("loading", true);
  cursor.set("total", oldTotal - 1);
  cursor.set("pagination", newPagination);
  cursor.select("models").unset(id);

  return Axios.delete(url)
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
        cursor.select("models").set(id, oldModel);
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
