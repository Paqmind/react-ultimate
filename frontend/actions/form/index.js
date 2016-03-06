import UUID from "node-uuid";
import Lens from "paqmind.data-lens";
import TcLens from "paqmind.tcomb-lens";
import {curry} from "ramda";
import {merge, unflattenObject} from "shared/helpers/common";
import {formatTyped} from "shared/formatters";
import {validateData} from "shared/validation";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";


// Cursor, String, Product -> Maybe Product
function updateAddForm(UICursor, key, data) {
  console.debug(`.updateAddForm(${key}, ...)`);

  let form = UICursor.get("addForm");
  let newForm = UICursor.set("addForm", Lens(key).set(form, data));
  return Promise.resolve(newForm);
}

// Cursor, String, Product -> Maybe Product
function updateEditForm(UICursor, key, data) {
  console.debug(`.updateEditForm(${key}, ...)`);

  let form = UICursor.get("editForm");
  let newForm = UICursor.set("editForm", Lens(key).set(form, data));
  return Promise.resolve(newForm);
}

// Cursor, String, Type -> Maybe String
function validateAddForm(UICursor, Type, key) {
  console.debug(`.validateAddForm(${key})`);

  if (!key && !UICursor.select("addForm").get("id")) {
    UICursor.select("addForm", "id").set(UUID.v4());
  }

  let {addForm, addFormErrors} = UICursor.get();
  let data = Lens(key).get(addForm);
  let type = TcLens(key).get(Type);

  let {valid, errors, value} = validateData(data, type, key);
  if (valid) {
    UICursor.set("addFormErrors", merge(addFormErrors, unflattenObject({[key]: undefined})));
    return Promise.resolve(value);
  } else {
    UICursor.set("addFormErrors", merge(addFormErrors, errors));
    return Promise.reject(errors);
  }
}

// Cursor, String, Type -> Maybe String
function validateEditForm(UICursor, Type, key) {
  console.debug(`.validateEditForm(${key})`);

  let {editForm, editFormErrors} = UICursor.get();
  let data = Lens(key).get(editForm);
  let type = TcLens(key).get(Type);

  let {valid, errors, value} = validateData(data, type, key);
  if (valid) {
    UICursor.set("editFormErrors", merge(editFormErrors, unflattenObject({[key]: undefined})));
    return Promise.resolve(value);
  } else {
    UICursor.set("editFormErrors", merge(editFormErrors, errors));
    return Promise.reject(errors);
  }
}

// Cursor
function resetAddForm(UICursor) {
  console.debug(`.resetAddForm`);

  UICursor.set("addForm", {});
  UICursor.set("addFormErrors", {});
}

// Cursor
function resetEditForm(UICursor, Type, origin) {
  let form = formatTyped(Type, origin);
  UICursor.set("editForm", form);
  UICursor.set("editFormErrors", {});
}

export default {
  updateAddForm: curry(updateAddForm),
  validateAddForm: curry(validateAddForm),
  resetAddForm: curry(resetAddForm),
  updateEditForm: curry(updateEditForm),
  validateEditForm: curry(validateEditForm),
  resetEditForm: curry(resetEditForm),
};
