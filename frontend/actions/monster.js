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
import api from "shared/api/monster";
import {MONSTER} from "shared/constants";
import {Monster} from "shared/types";


let UIMonstersCursor = state.select("UI", "monsters");
let UIMonsterCursor = state.select("UI", "monster");
let UIMonstersUSACitizenCursor = state.select("UI", "monstersUSACitizen");

// TODO: syntax can be simplified with re-exports (wait for proper IDE support)
export default {
  // INDEX
  loadIndex: () => loadIndex(UIMonstersCursor, Monster, api),
  updateUIFilters: updateUIFilters(UIMonstersCursor, MONSTER),
  updateUISorts: updateUISorts(UIMonstersCursor, MONSTER),
  updateUIPagination: updateUIPagination(UIMonstersCursor, MONSTER),

  loadIndexUSACitizen: () => loadIndex(UIMonstersUSACitizenCursor, Monster, api),

  // CRUD
  loadItem: loadItem(UIMonsterCursor, Monster, api),
  addItem: () => addItem(UIMonsterCursor, Monster, api),
  editItem: () => editItem(UIMonsterCursor, Monster, api),
  removeItem: removeItem(UIMonsterCursor, api),

  updateAddForm: updateAddForm(UIMonsterCursor),
  updateEditForm: updateEditForm(UIMonsterCursor),
  validateAddForm: validateAddForm(UIMonsterCursor, Monster),
  validateEditForm: validateEditForm(UIMonsterCursor, Monster),
  resetAddForm: () => resetAddForm(UIMonsterCursor),
  resetEditForm: resetEditForm(UIMonsterCursor, Monster),
};
