// IMPORTS =========================================================================================
import Axios from "axios";
import {recalculatePaginationWithoutModel} from "frontend/helpers/pagination";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";
import {handleInvalidOffset} from "../load-index/monster";
import fetchIndex from "../fetch-index/monster";

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

      // Invoke new load on empty data
      if (!state.facets.currentRobots.get().length) {
        fetchIndex().then(handleInvalidOffset);
      }

      // Add alert
      alertActions.addModel({message: "Action succeed", category: "success"});

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
        cursor.set("total", oldTotal);
        cursor.select("models").set(id, oldModel);
        cursor.set("pagination", oldPagination);

        // Add alert
        alertActions.addModel({message: "Action failed: " + loadError.description, category: "error"});

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
