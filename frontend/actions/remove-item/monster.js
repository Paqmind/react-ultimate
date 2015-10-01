import {indexOf, insert, reject} from "ramda";
import api from "shared/api/monster";
import {recommendOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import {indexRouter} from "frontend/router";
import ajax from "frontend/ajax";
import alertActions from "frontend/actions/alert";
import fetchIndex from "frontend/actions/fetch-index/monster";

let url$ = state.select("url");
let data$ = state.select(api.plural);
let items$ = data$.select("items");

// Id -> Maybe Monster
export default function removeItem(id) {
  console.debug(api.plural + `.removeItem(${id})`);

  let {items, pagination} = data$.get();

  // Optimistic update
  let oldItem = items[id];
  let oldIndex = indexOf(id, pagination);

  items$.unset(id);
  data$.apply("total", t => t ? t - 1 : t);
  data$.apply("pagination", pp => reject(_id => _id == id, pp));

  if (url$.get("route") == api.singular + "-index") {
    setImmediate(() => {
      let {total, offset, limit} = data$.get();

      let recommendedOffset = recommendOffset(total, offset, limit);
      if (offset > recommendedOffset) {
        indexRouter.transitionTo(undefined, {offset: recommendedOffset});
      }
    });
  }

  return ajax.delete(api.itemUrl.replace(":id", id))
    .then(response => {
      let {filters, sorts, offset, limit, pagination} = data$.get();

      if (response.status.startsWith("2")) {
        if (url$.get("route") == api.singular + "-index") {
          if (!pagination[offset + limit - 1]) {
            fetchIndex(filters, sorts, offset + limit - 1, 1);
          }
        }
        return oldItem;
      } else {
        items$.set(id, oldItem);
        data$.apply("total", t => t + 1);
        if (oldIndex != -1) {
          data$.apply("pagination", pp => insert(oldIndex, id, pp));
        }
        alertActions.addItem({message: "Remove Monster failed with message " + response.statusText, category: "error"});
        return undefined;
      }
    });
}
