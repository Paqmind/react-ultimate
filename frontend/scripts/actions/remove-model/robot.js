// IMPORTS =========================================================================================
import Axios from "axios";
import {recalculatePaginationWithoutModel} from "frontend/helpers/pagination";
import state from "frontend/state";
import router from "frontend/router";
import alertActions from "frontend/actions/alert";
import loadIndex from "frontend/actions/load-index/robot";

// ACTIONS =========================================================================================
export default function remove(id) {
  let urlCursor = state.select("url");
  let cursor = state.select("robots");

  let oldTotal = cursor.get("total");
  let oldPagination = cursor.get("pagination");
  let oldModel = state.select("robots", "models", id).get();
  console.log("oldPagination:", oldPagination);
  let newPagination = recalculatePaginationWithoutModel(id, oldPagination);
  console.log("newPagination:", newPagination);
  let url = `/api/robots/${id}`;

  // Optimistic action
  cursor.set("loading", true);
  cursor.set("total", oldTotal - 1);
  cursor.set("pagination", newPagination);
  cursor.select("models").unset(id);

  return Axios.delete(url)
    .then(response => {
      cursor.merge({loading: false, loadError: undefined});

      // Transition to index page
      let requiredPath = router.makePath("robot-index");
      let currentPath = router.makePath()

      console.log("requiredPath:", requiredPath);
      console.log("currentPath:", currentPath);

      if (currentPath != requiredPath) {
        router.transitionTo("robot-index");
      }

      // Add alert
      alertActions.add({message: "Action succeed", category: "success"});

      loadIndex();

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
