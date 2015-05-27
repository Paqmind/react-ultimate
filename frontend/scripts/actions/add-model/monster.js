// IMPORTS =========================================================================================
import {append} from "ramda";
import Axios from "axios";
import Monster from "shared/models/monster";
import state from "frontend/scripts/state";
import {router} from "frontend/scripts/router";
import alertActions from "frontend/scripts/actions/alert";

// CURSORS =========================================================================================
let modelCursor = state.select("monsters");

// ACTIONS =========================================================================================
export default function addModel(model) {
  console.debug(`addModel(...)`);

  let newModel = Monster(model);
  let id = newModel.id;
  let url = `/api/monsters/${id}`;

  let filters = modelCursor.get("filters");
  let sorts = modelCursor.get("sorts");
  let total = modelCursor.get("total");
  let models = modelCursor.get("models");
  let pagination = modelCursor.get("pagination");
  let allModelsAreLoaded = state.facets.allMonstersAreLoaded.get();

  // Optimistic action
  modelCursor.set("loading", true);
  modelCursor.set("total", total + 1);
  modelCursor.select("models").set(id, newModel);
  if (allModelsAreLoaded) {
    // Inject new id at whatever place
    modelCursor.apply("pagination", pagination => {
      return append(id, pagination);
    });
  } else {
    // Pagination is messed up, do reset
    modelCursor.set("pagination", []);
    modelCursor.set("total", 0);
  }

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
      router.transitionTo("monster-detail", {id: newModel.id});

      // Add alert
      alertActions.addModel({message: "Action `Monster:addModel` succeed", category: "success"});
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
        alertActions.addModel({message: "Action `Monster:addModel` failed: " + response.statusText, category: "error"});
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
