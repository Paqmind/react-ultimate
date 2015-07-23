import api from "shared/api/robot";
import Model from "shared/models/robot";
import state from "frontend/state";
import ajax from "frontend/ajax";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $models = $data.select("models");

// ACTIONS =========================================================================================
// Id -> Maybe Model
export default function fetchModel(id) {
  console.debug(api.plural + `.fetchModel(${id})`);

  return ajax.get(api.modelUrl.replace(`:id`, id))
    .then(response => {
      if (response.status.startsWith("2")) {
        let model = Model(response.data.data);
        $models.set(id, model);
        return model;
      } else {
        return;
      }
    });
}
