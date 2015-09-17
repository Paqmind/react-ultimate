import api from "shared/api/product";
import Model from "shared/models/product";
import state from "frontend/state";
import ajax from "frontend/ajax";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $models = $data.select("models");

// ACTIONS =========================================================================================
// ModelData -> Maybe Model
function updateModel(modelFragment) {
  console.debug(api.plural + `.updateModel(${modelFragment.id})`);

  // TODO check for modelFragment.id ?!

  let id = modelFragment.id;

  // Optimistic update
  let oldModel = $models.get(id);
  let model = $models.merge(id, modelFragment);

  return ajax.patch(api.itemUrl.replace(":id", id), modelFragment)
    .then(response => {
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          model = $models.set(id, Model(response.data.data));
        }
        return model;
      } else {
        $models.set(id, oldModel);
        alertActions.addModel({message: "Edit Product failed with message " + response.statusText, category: "error"});
        return;
      }
    });
}

function updateModelUnsync(modelFragment) {
  console.debug(api.plural + `.updateModelUnsync(...)`);

  // TODO check for modelFragment.id ?!

  let id = modelFragment.id;
  let model = $models.merge(id, modelFragment);

  return Promise.resolve(model);
}

export default {
  updateModel, updateModelUnsync,
};
