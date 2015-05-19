// IMPORTS =========================================================================================
import Axios from "axios";
import {recalculatePaginationWithoutModel} from "frontend/helpers/pagination";
import state from "frontend/state";
import {indexRouter} from "frontend/router";
import alertActions from "frontend/actions/alert";
import {handleInvalidOffset} from "../load-index/robot";
import fetchIndex from "../fetch-index/robot";

// ACTIONS =========================================================================================
export default function removeModel(id) {
  let url = `/api/robots/${id}`;
  let urlCursor = state.select("url");
  let cursor = state.select("robots");

  let filters = cursor.get("filters");
  let sorts = cursor.get("sorts");
  let offset = cursor.get("offset");
  let limit = cursor.get("limit");
  let total = cursor.get("total");
  let models = cursor.get("models");
  let pagination = cursor.get("pagination");

  // Optimistic action
  cursor.set("loading", true);
  cursor.set("total", total - 1);
  cursor.set("pagination", recalculatePaginationWithoutModel(filters, sorts, models, pagination, id));
  cursor.select("models").unset(id);
  let newTotal = cursor.get("total");
  let newModels = cursor.get("models");
  let newPagination = cursor.get("pagination");

  return Axios.delete(url)
    .then(response => {
      cursor.merge({loading: false, loadError: undefined});

      // Upload data
      if (!newPagination[offset + limit - 1]) {
        fetchIndex(filters, sorts, offset + limit - 1, 1, newModels, newPagination);
      }

      // Transition to index page
      let currentRoute = urlCursor.get("route");
      if (currentRoute != "robot-index") {
        indexRouter.transitionTo("robot-index");
      }

      // Add alert
      alertActions.addModel({message: "Action `Robot:removeModel` succeed", category: "success"});

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
        cursor.set("total", total);
        cursor.set("models", models);
        cursor.set("pagination", pagination);

        // Add alert
        alertActions.addModel({message: "Action `Robot:removeModel` failed: " + loadError.description, category: "error"});

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
