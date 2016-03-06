// INDEX
import loadIndex from "frontend/actions/load-index/robots";
import {updateUIFilters, updateUISorts, updateUIPagination} from "frontend/actions/update-ui/robots";

// CRUD
import loadItem from "frontend/actions/load-item/robot";
import addItem from "frontend/actions/add-item/robot";
import editItem from "frontend/actions/edit-item/robot";
import removeItem from "frontend/actions/remove-item/robot";
import {updateAddForm, validateAddForm, resetAddForm,
        updateEditForm, validateEditForm, resetEditForm} from "frontend/actions/form/robot";

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
