import UUID from "node-uuid";
import Lens from "paqmind.data-lens";
import TcLens from "paqmind.tcomb-lens";
import {merge, unflattenObject} from "shared/helpers/common";
import {formatTyped} from "shared/formatters";
import {validateData} from "shared/validation";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";


// Cursor, String, Product -> Maybe Product
function _updateAddForm(UICursor, key, data) {
  console.debug(`.updateAddForm(${key}, ...)`);

  let form = UICursor.get("addForm");
  let newForm = UICursor.set("addForm", Lens(key).set(form, data));
  return Promise.resolve(newForm);
}

// Cursor, String, Product -> Maybe Product
function _updateEditForm(UICursor, key, data) {
  console.debug(`.updateEditForm(${key}, ...)`);

  let form = UICursor.get("editForm");
  let newForm = UICursor.set("editForm", Lens(key).set(form, data));
  return Promise.resolve(newForm);
}

// Cursor, String, Type -> Maybe String
function _validateAddForm(UICursor, key, Type) {
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
function _validateEditForm(UICursor, key, Type) {
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
function _resetAddForm(UICursor) {
  console.debug(`.resetAddForm`);

  UICursor.set("addForm", {});
  UICursor.set("addFormErrors", {});
}

// Cursor
function _resetEditForm(UICursor, Type, origin) {
  let form = formatTyped(Type, origin);
  UICursor.set("editForm", form);
  UICursor.set("editFormErrors", {});
}

export default {
  _updateAddForm, _validateAddForm, _resetAddForm,
  _updateEditForm, _validateEditForm, _resetEditForm,
};
