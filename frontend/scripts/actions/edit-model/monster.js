// IMPORTS =========================================================================================
import Axios from "axios";
import Monster from "shared/models/monster";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// CURSORS =========================================================================================
let modelCursor = state.select("monsters");

// ACTIONS =========================================================================================
export default function edit(model) {
  let newModel = Monster(model);
  let id = newModel.id;
  let url = `/api/monsters/${id}`;

  let models = modelCursor.get("models");
  let filters = modelCursor.get("filters");
  let sorts = modelCursor.get("sorts");
  let pagination = modelCursor.get("pagination");

  // Optimistic action
  modelCursor.set("loading", true);
  modelCursor.select("models").set(id, newModel);

  return Axios.put(url, newModel)
    .then(response => {
      modelCursor.merge({loading: false, loadError: undefined});

      // Add alert
      alertActions.addModel({message: "Action `Monster:editModel` succeed", category: "success"});
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
            url: url
          }
        });
        modelCursor.set("models", models);

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
