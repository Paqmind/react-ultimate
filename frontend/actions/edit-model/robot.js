import Axios from "axios";
import Robot from "shared/models/robot";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// CURSORS =========================================================================================
let modelCursor = state.select("robots");

// ACTIONS =========================================================================================
export default function edit(model) {
  let newModel = Robot(model);
  let id = newModel.id;
  let url = `/api/robots/${id}`;

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
      alertActions.addModel({message: "Action `Robot:editModel` succeed", category: "success"});
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
        alertActions.addModel({message: "Action `Robot:editModel` failed: " + response.statusText, category: "error"});
        return response.status;
      }
    });
}
