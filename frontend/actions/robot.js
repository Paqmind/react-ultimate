// INDEX
import loadIndex from "frontend/actions/load-index/index";
import {updateUIFilters, updateUISorts, updateUIPagination} from "frontend/actions/update-ui/index";

// CRUD
import loadItem from "frontend/actions/load-item/index";
import addItem from "frontend/actions/add-item/index";
import editItem from "frontend/actions/edit-item/index";
import removeItem from "frontend/actions/remove-item/index";
import {updateAddForm, validateAddForm, resetAddForm,
        updateEditForm, validateEditForm, resetEditForm} from "frontend/actions/form/index";

import state from "frontend/state";
import api from "shared/api/robot";
import {ROBOT} from "shared/constants";
import {Robot} from "shared/types";


let UIRobotsCursor = state.select("UI", "robots");
let UIRobotCursor = state.select("UI", "robot");

// TODO: syntax can be simplified with re-exports (wait for proper IDE support)
export default {
  // INDEX
  loadIndex: () => loadIndex(UIRobotsCursor, Robot, api),
  updateUIFilters: updateUIFilters(UIRobotsCursor, ROBOT),
  updateUISorts: updateUISorts(UIRobotsCursor, ROBOT),
  updateUIPagination: updateUIPagination(UIRobotsCursor, ROBOT),

  // CRUD
  loadItem: loadItem(UIRobotCursor, Robot, api),
  addItem: () => addItem(UIRobotCursor, Robot, api),
  editItem: () => editItem(UIRobotCursor, Robot, api),
  removeItem: removeItem(UIRobotCursor, api),

  updateAddForm: updateAddForm(UIRobotCursor),
  updateEditForm: updateEditForm(UIRobotCursor),
  validateAddForm: validateAddForm(UIRobotCursor, Robot),
  validateEditForm: validateEditForm(UIRobotCursor, Robot),
  resetAddForm: () => resetAddForm(UIRobotCursor),
  resetEditForm: resetEditForm(UIRobotCursor, Robot),
};
