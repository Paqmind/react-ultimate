import {indexOf, reject} from "ramda";
import api from "shared/api/robot";
import {recommendOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import {indexRouter} from "frontend/router";
import {ALERT} from "frontend/constants";
import ajax from "frontend/ajax";
import fetchIndex from "frontend/actions/fetch-index/robot";

// CURSORS =========================================================================================
let $url = state.select("url");
let $data = state.select(api.plural);
let $models = $data.select("models");

// ACTIONS =========================================================================================
// Id -> Maybe Model
export default function removeModel(id) {
  console.debug(api.plural + `.removeModel(${id})`);

  let {models, pagination} = $data.get();

  // Optimistic update
  let oldModel = models[id];
  let oldIndex = indexOf(id, pagination);

  $models.unset(id);
  $data.apply("total", t => t ? t - 1 : t);
  $data.apply("pagination", pp => reject(_id => _id == id, pp));

  if ($url.get("route") == api.singular + "-index") {
    setImmediate(() => {
      let {total, offset, limit} = $data.get();

      let recommendedOffset = recommendOffset(total, offset, limit);
      if (offset > recommendedOffset) {
        indexRouter.transitionTo(undefined, {offset: recommendedOffset});
      }
    });
  }

  return ajax.delete(api.modelUrl.replace(":id", id))
    .then(response => {
      let {filters, sorts, offset, limit, pagination} = $data.get();

      if (response.status.startsWith("2")) {
        if ($url.get("route") == api.singular + "-index") {
          if (!pagination[offset + limit - 1]) {
            fetchIndex(filters, sorts, offset + limit - 1, 1);
          }
        }
        return oldModel;
      } else {
        $models.set(id, oldModel);
        $data.apply("total", t => t + 1);
        if (oldIndex != -1) {
          $data.apply("pagination", pp => insert(oldIndex, id, pp));
        }
        return;
      }
    });
}
