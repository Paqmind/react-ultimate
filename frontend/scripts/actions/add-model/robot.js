// IMPORTS =========================================================================================
import Axios from "axios";
import Robot from "shared/models/robot";
import {recalculatePaginationWithModel} from "frontend/helpers/pagination";
import state from "frontend/state";
import router from "frontend/router";
import alertActions from "frontend/actions/alert";

// ACTIONS =========================================================================================
export default function add(model) {
  let cursor = state.select("robots");

  let oldTotal = cursor.get("total");
  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let oldModels = cursor.get("models");
  let oldPagination = cursor.get("pagination");
  let newModel = Robot(model);
  let id = newModel.id;
  let newPagination = recalculatePaginationWithModel(filters, sorts, id, oldPagination, oldModels);
  let url = `/api/robots/${id}`;

  // Optimistic action
  cursor.set("loading", true);
  cursor.set("total", oldTotal + 1);
  cursor.set("pagination", newPagination);
  cursor.select("models").set(id, newModel);

  return Axios.put(url, newModel)
    .then(response => {
      cursor.merge({loading: false, loadError: undefined});

      // Transition to index page
      router.transitionTo("robot-index");

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
        cursor.set("total", oldTotal);
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
