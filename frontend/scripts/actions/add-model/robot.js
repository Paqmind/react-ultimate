// IMPORTS =========================================================================================
import {append} from "ramda";
import Axios from "axios";
import Robot from "shared/models/robot";
import state from "frontend/scripts/state";
import {router} from "frontend/scripts/router";
import alertActions from "frontend/scripts/actions/alert";

// CURSORS =========================================================================================
let modelCursor = state.select("robots");

// ACTIONS =========================================================================================
export default function addModel(model) {
  console.debug(`addModel(...)`);

  let newModel = Robot(model);
  let id = newModel.id;
  let url = `/api/robots/${id}`;

  let filters = modelCursor.get("filters");
  let sorts = modelCursor.get("sorts");
  let total = modelCursor.get("total");
  let models = modelCursor.get("models");
  let pagination = modelCursor.get("pagination");

  // Optimistic action
  modelCursor.set("loading", true);
  modelCursor.set("total", total + 1);
  modelCursor.set("pagination", recalculatePaginationWithModel(filters, sorts, models, pagination, id));
  modelCursor.select("models").set(id, newModel);

  let newTotal = modelCursor.get("total");
  let newModels = modelCursor.get("models");
  let newPagination = modelCursor.get("pagination");

  return Axios.put(url, newModel)
    .then(response => {
      modelCursor.merge({
        loading: false,
        loadError: undefined
      });

      // Transition to detail page
      router.transitionTo("robot-detail", {id: newModel.id});

      // Add alert
      alertActions.addModel({message: "Action `Robot:addModel` succeed", category: "success"});
      return response.status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        // Cancel action
        modelCursor.merge({
          loading: false,
          loadError: {
            status: response.status,
            description: response.statusText,
            url
          }
        });
        modelCursor.set("total", total);
        modelCursor.select("models").unset(id);
        modelCursor.set("pagination", pagination);

        // Add alert
        alertActions.addModel({message: "Action `Robot:addModel` failed: " + response.statusText, category: "error"});
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
