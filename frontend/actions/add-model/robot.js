import {append, reject} from "ramda";
import api from "shared/api/robot";
import Model from "shared/models/robot";
import state from "frontend/state";
import {router} from "frontend/router";
import ajax from "frontend/ajax";
import alertActions from "frontend/actions/alert";

// CURSORS =========================================================================================
let $url = state.select("url");
let $data = state.select(api.plural);
let $models = $data.select("models");

// ACTIONS =========================================================================================
// ModelData -> Maybe Model
export default function addModel(model) {
  console.debug(api.plural + `.addModel(...)`);

  model = Model(model);
  let id = model.id;

  // Optimistic update
  $data.apply("total", t => t + 1);
  $models.set(id, model);

  if (state.get("$allRobotsAreLoaded")) {
    // Inject new id at whatever place
    $data.apply("pagination", pp => append(id, pp));
  } else {
    // Pagination is messed up, do reset
    $data.set("total", 0);
    $data.set("pagination", []);
  }

  if ($url.get("route") == api.singular + "-add") {
    setImmediate(() => {
      router.transitionTo(api.singular + "-detail", {id: model.id});
    });
  }

  return ajax.put(api.modelUrl.replace(":id", id), model)
    .then(response => {
      let {total, models, pagination} = $data.get();
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          model = $models.set(id, Model(response.data.data));
        }
        return model;
      } else {
        $models.unset(id);
        $data.apply("total", t => t ? t - 1 : t);
        $data.apply("pagination", pp => reject(id => id == model.id, pp));
        alertActions.addModel({message: "Add Robot failed with message " + response.statusText, category: "error"});
        return;
      }
    });
}
