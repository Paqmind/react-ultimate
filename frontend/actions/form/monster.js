import {_updateAddForm, _validateAddForm, _resetAddForm,
        _updateEditForm, _validateEditForm, _resetEditForm} from "frontend/actions/form/index";
import state from "frontend/state";
import api from "shared/api/robot";
import {Monster} from "shared/types";


let UICursor = state.select("UI", "monster");

function updateAddForm(key, data) {
 return _updateAddForm(UICursor, key, data);
}

function updateEditForm(key, data) {
  return _updateEditForm(UICursor, key, data);
}

function validateAddForm(key) {
   return _validateAddForm(UICursor, key, Monster);
}

function validateEditForm(key) {
  return _validateEditForm(UICursor, key, Monster);
}

function resetAddForm() {
  return _resetAddForm(UICursor);
}

function resetEditForm(origin) {
  return _resetEditForm(UICursor, Monster, origin);
}

export default {
  updateAddForm, validateAddForm, resetAddForm,
  updateEditForm, validateEditForm, resetEditForm,
};
