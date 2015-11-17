import UUID from "node-uuid";
import Lens from "paqmind.data-lens";
import TcLens from "paqmind.tcomb-lens";
import {merge, unflattenObject} from "shared/helpers/common";
import api from "shared/api/monster";
import {Monster} from "shared/types";
import {formatTyped} from "shared/formatters";
import {validateData} from "shared/validation";
import state from "frontend/state";
import ajax from "frontend/ajax";
import alertActions from "frontend/actions/alert";
import addItem from "frontend/actions/add-item/monster";

let dataCursor = state.select(api.plural);
let itemsCursor = dataCursor.select("items");

// ProductData -> Maybe Product
function updateAddForm(key, data) {
  console.debug(api.plural + `.updateAddForm(${key}, ...)`);

  let form = dataCursor.get("addForm");
  let newForm = dataCursor.set("addForm", Lens(key).set(form, data));
  return Promise.resolve(newForm);
}

function updateEditForm(key, data) {
  console.debug(api.plural + `.updateEditForm(${key}, ...)`);

  let form = dataCursor.get("editForm");
  let newForm = dataCursor.set("editForm", Lens(key).set(form, data));
  return Promise.resolve(newForm);
}

function validateAddForm(key) {
  console.debug(api.plural + `.validateAddForm(${key})`);

  if (!key && !dataCursor.select("addForm").get("id")) {
    dataCursor.select("addForm", "id").set(UUID.v4());
  }

  let {addForm, addFormErrors} = dataCursor.get();
  let data = Lens(key).get(addForm);
  let type = TcLens(key).get(Monster);

  let {valid, errors, value} = validateData(data, type, key);
  if (valid) {
    dataCursor.set("addFormErrors", merge(unflattenObject({[key]: undefined}), addFormErrors));
    return Promise.resolve(value);
  } else {
    dataCursor.set("addFormErrors", merge(errors, addFormErrors));
    return Promise.reject(errors);
  }
}

function validateEditForm(key) {
  console.debug(api.plural + `.validateEditForm(${key})`);

  let {editForm, editFormErrors} = dataCursor.get();
  let data = Lens(key).get(editForm);
  let type = TcLens(key).get(Monster);

  let {valid, errors, value} = validateData(data, type, key);
  if (valid) {
    dataCursor.set("editFormErrors", merge(unflattenObject({[key]: undefined}), editFormErrors));
    return Promise.resolve(value);
  } else {
    dataCursor.set("editFormErrors", merge(errors, editFormErrors));
    return Promise.reject(errors);
  }
}

function resetAddForm(id) {
  dataCursor.set("addForm", {});
  dataCursor.set("addFormErrors", {});
}

function resetEditForm(id) {
  let item = itemsCursor.get(id);
  let form = formatTyped(Monster, item);
  dataCursor.set("editForm", form);
  dataCursor.set("editFormErrors", {});
}

export default {
  updateAddForm, validateAddForm, resetAddForm,
  updateEditForm, validateEditForm, resetEditForm,
};
