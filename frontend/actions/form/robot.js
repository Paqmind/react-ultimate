import Lens from "paqmind.data-lens";
import TcLens from "paqmind.tcomb-lens";
import {merge, unflattenObject} from "shared/helpers/common";
import api from "shared/api/robot";
import {Robot, AlmostRobot} from "shared/types/robot";
import {formatTyped} from "shared/formatters";
import {validateData} from "shared/validation";
import state from "frontend/state";
import ajax from "frontend/ajax";
import alertActions from "frontend/actions/alert";
import addItem from "frontend/actions/add-item/robot";

let data$ = state.select(api.plural);
let items$ = data$.select("items");

// ProductData -> Maybe Product
function updateAddForm(key, data) {
  console.debug(api.plural + `.updateAddForm(${key}, ...)`);

  let form = data$.get("addForm");
  let newForm = data$.set("addForm", Lens(key).set(form, data));
  return Promise.resolve(newForm);
}

function updateEditForm(key, data) {
  console.debug(api.plural + `.updateEditForm(${key}, ...)`);

  let form = data$.get("editForm");
  let newForm = data$.set("editForm", Lens(key).set(form, data));
  return Promise.resolve(newForm);
}

function validateAddForm(key) {
  console.debug(api.plural + `.validateAddForm(${key})`);

  let {addForm, addFormErrors} = data$.get();
  let data = Lens(key).get(addForm);
  let type = TcLens(key).get(AlmostRobot);

  let {valid, errors, value} = validateData(data, type, key);
  if (valid) {
    data$.set("addFormErrors", merge(unflattenObject({[key]: undefined}), addFormErrors));
    return Promise.resolve(value);
  } else {
    data$.set("addFormErrors", merge(errors, addFormErrors));
    return Promise.reject(errors);
  }
}

function validateEditForm(key) {
  console.debug(api.plural + `.validateEditForm(${key})`);

  let {editForm, editFormErrors} = data$.get();
  let data = Lens(key).get(editForm);
  let type = TcLens(key).get(Robot);

  let {valid, errors, value} = validateData(data, type, key);
  if (valid) {
    data$.set("editFormErrors", merge(unflattenObject({[key]: undefined}), editFormErrors));
    return Promise.resolve(value);
  } else {
    data$.set("editFormErrors", merge(errors, editFormErrors));
    return Promise.reject(errors);
  }
}

function resetAddForm(id) {
  data$.set("addForm", {});
  data$.set("addFormErrors", {});
}

function resetEditForm(id) {
  let item = items$.get(id);
  let form = formatTyped(item, Robot);
  data$.set("editForm", form);
  data$.set("editFormErrors", {});
}

export default {
  updateAddForm, validateAddForm, resetAddForm,
  updateEditForm, validateEditForm, resetEditForm,
};
