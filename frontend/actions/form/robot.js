import UUID from "node-uuid";
import Lens from "paqmind.data-lens";
import TcLens from "paqmind.tcomb-lens";
import {merge, unflattenObject} from "shared/helpers/common";
import api from "shared/api/robot";
import {Robot} from "shared/types";
import {formatTyped} from "shared/formatters";
import {validateData} from "shared/validation";
import state from "frontend/state";
import ajax from "frontend/ajax";
import alertActions from "frontend/actions/alert";
import addItem from "frontend/actions/add-item/robot";

let DBCursor = state.select("DB", api.plural);
let UICursor = state.select("UI", api.plural);

// ProductData -> Maybe Product
function updateAddForm(key, data) {
  console.debug(api.plural + `.updateAddForm(${key}, ...)`);

  let form = UICursor.get("addForm");
  let newForm = UICursor.set("addForm", Lens(key).set(form, data));
  return Promise.resolve(newForm);
}

function updateEditForm(key, data) {
  console.debug(api.plural + `.updateEditForm(${key}, ...)`);

  let form = UICursor.get("editForm");
  let newForm = UICursor.set("editForm", Lens(key).set(form, data));
  return Promise.resolve(newForm);
}

function validateAddForm(key) {
  console.debug(api.plural + `.validateAddForm(${key})`);

  if (!key && !UICursor.select("addForm").get("id")) {
    UICursor.select("addForm", "id").set(UUID.v4());
  }

  let {addForm, addFormErrors} = UICursor.get();
  let data = Lens(key).get(addForm);
  let type = TcLens(key).get(Robot);

  let {valid, errors, value} = validateData(data, type, key);
  if (valid) {
    UICursor.set("addFormErrors", merge(addFormErrors, unflattenObject({[key]: undefined})));
    return Promise.resolve(value);
  } else {
    UICursor.set("addFormErrors", merge(addFormErrors, errors));
    return Promise.reject(errors);
  }
}

function validateEditForm(key) {
  console.debug(api.plural + `.validateEditForm(${key})`);

  let {editForm, editFormErrors} = UICursor.get();
  let data = Lens(key).get(editForm);
  let type = TcLens(key).get(Robot);

  let {valid, errors, value} = validateData(data, type, key);
  if (valid) {
    UICursor.set("editFormErrors", merge(editFormErrors, unflattenObject({[key]: undefined})));
    return Promise.resolve(value);
  } else {
    UICursor.set("editFormErrors", merge(editFormErrors, errors));
    return Promise.reject(errors);
  }
}

function resetAddForm(id) {
  UICursor.set("addForm", {});
  UICursor.set("addFormErrors", {});
}

function resetEditForm(id) {
  let item = DBCursor.get(id);
  let form = formatTyped(Robot, item);
  UICursor.set("editForm", form);
  UICursor.set("editFormErrors", {});
}

export default {
  updateAddForm, validateAddForm, resetAddForm,
  updateEditForm, validateEditForm, resetEditForm,
};
