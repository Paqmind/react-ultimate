import api from "shared/api/robot";
import Model from "shared/models/robot";
import state from "frontend/state";
import ajax from "frontend/ajax";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $models = $data.select("models");

// ACTIONS =========================================================================================
// ModelData -> Maybe Model
export default function editModel(model) {
  console.debug(api.plural + `.editModel(${model.id})`);

  model = Model(model);
  let id = model.id;

  // Optimistic update
  let oldModel = $models.get(id);
  $models.set(id, model);

  return ajax.put(api.modelUrl.replace(":id", id), model)
    .then(response => {
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          model = $models.set(id, Model(response.data.data));
        }
        return model;
      } else {
        $models.set(id, oldModel);
        alertActions.addModel({message: "Edit Robot failed with message " + response.statusText, category: "error"});
        return;
      }
    });
}
