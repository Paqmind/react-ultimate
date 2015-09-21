import api from "shared/api/product";
import Product from "shared/types/product";
import state from "frontend/state";
import ajax from "frontend/ajax";

// CURSORS =========================================================================================
let $data = state.select(api.plural);
let $items = $data.select("items");

// ACTIONS =========================================================================================
// Object -> Maybe Product
function updateItem(dataFragment) {
  console.debug(api.plural + `.updateItem(${dataFragment.id})`);

  // TODO check for itemFragment.id ?!

  let id = itemFragment.id;

  // Optimistic update
  let oldProduct = $items.get(id);
  let item = $items.merge(id, itemFragment);

  return ajax.patch(api.itemUrl.replace(":id", id), itemFragment)
    .then(response => {
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = $items.set(id, Product(response.data.data));
        }
        return item;
      } else {
        $items.set(id, oldProduct);
        alertActions.addItem({message: "Edit Product failed with message " + response.statusText, category: "error"});
        return;
      }
    });
}

function updateItemUnsync(itemFragment) {
  console.debug(api.plural + `.updateItemUnsync(...)`);

  // TODO check for itemFragment.id ?!

  let id = itemFragment.id;
  let item = $items.merge(id, itemFragment);

  return Promise.resolve(item);
}

export default {
  updateItem, updateItemUnsync,
};
