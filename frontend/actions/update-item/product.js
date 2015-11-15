import api from "shared/api/product";
import Product from "shared/types/product";
import state from "frontend/state";
import ajax from "frontend/ajax";
import alertActions from "frontend/actions/alert";

let dataCursor = state.select(api.plural);
let itemsCursor = dataCursor.select("items");

// Object -> Maybe Product
function updateItem(data) {
  console.debug(api.plural + `.updateItem(${data.id})`);

  // TODO check for data.id ?!
  let id = data.id;

  // Optimistic update
  let oldItem = itemsCursor.get(id);
  let item = itemsCursor.merge(id, data);

  return ajax.patch(api.itemUrl.replace(":id", id), data)
    .then(response => {
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = itemsCursor.set(id, Product(response.data.data));
        }
        return item;
      } else {
        itemsCursor.set(id, oldItem);
        alertActions.addItem({message: "Edit Product failed with message " + response.statusText, category: "error"});
        return undefined;
      }
    });
}

function updateItemUnsync(data) {
  console.debug(api.plural + `.updateItemUnsync(...)`);

  // TODO check for data.id ?!

  let id = data.id;
  let item = itemsCursor.merge(id, data);

  return Promise.resolve(item);
}

export default {
  updateItem, updateItemUnsync,
};
