// INDEX
import loadIndex from "frontend/actions/load-index/monsters";
import {updateUIFilters, updateUISorts, updateUIPagination} from "frontend/actions/update-ui/monsters";

// CRUD
import loadItem from "frontend/actions/load-item/monster";
import addItem from "frontend/actions/add-item/monster";
import editItem from "frontend/actions/edit-item/monster";
import removeItem from "frontend/actions/remove-item/monster";
import {updateAddForm, validateAddForm, resetAddForm,
        updateEditForm, validateEditForm, resetEditForm} from "frontend/actions/form/monster";

// TODO: syntax can be simplified with re-exports (wait for proper IDE support)
export default {
  // INDEX
  loadIndex,

  // CRUD
  loadItem,
  addItem, editItem, removeItem,
  updateAddForm, validateAddForm, resetAddForm,
  updateEditForm, validateEditForm, resetEditForm,
  updateUIFilters, updateUISorts, updateUIPagination,
};
