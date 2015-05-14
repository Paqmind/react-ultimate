// IMPORTS =========================================================================================
import Axios from "axios";
import Robot from "shared/models/robot";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// ACTIONS =========================================================================================
export default function edit(model) {
  let cursor = state.select("robots");

  let newModel = Robot(model);
  let id = newModel.id;
  let oldModel = cursor.select("models").get(id);
  let url = `/api/robots/${id}`;

  // Optimistic action
  cursor.set("loading", true);
  cursor.select("models").set(id, newModel);

  return Axios.put(url, newModel)
    .then(response => {
      cursor.merge({loading: false, loadError: undefined});

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
        cursor.select("models").set(id, oldModel);

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
