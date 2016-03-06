import {_updateAddForm, _validateAddForm, _resetAddForm,
        _updateEditForm, _validateEditForm, _resetEditForm} from "frontend/actions/form/index";
import state from "frontend/state";
import api from "shared/api/robot";
import {Robot} from "shared/types";


let UICursor = state.select("UI", "robot");

function updateAddForm(key, data) {
 return _updateAddForm(UICursor, key, data);
}

function updateEditForm(key, data) {
  return _updateEditForm(UICursor, key, data);
}

function validateAddForm(key) {
   return _validateAddForm(UICursor, key, Robot);
}

function validateEditForm(key) {
  return _validateEditForm(UICursor, key, Robot);
}

function resetAddForm() {
  return _resetAddForm(UICursor);
}

function resetEditForm(origin) {
  return _resetEditForm(UICursor, Robot, origin);
}

export default {
  updateAddForm, validateAddForm, resetAddForm,
  updateEditForm, validateEditForm, resetEditForm,
};
