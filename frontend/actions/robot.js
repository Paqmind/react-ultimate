// INDEX
import establishIndex from "frontend/actions/establish-index/robot"
import loadIndex from "frontend/actions/load-index/robot"
import fetchIndex from "frontend/actions/fetch-index/robot"

// CRUD
import establishItem from "frontend/actions/establish-item/robot"
import loadItem from "frontend/actions/load-item/robot"
import fetchItem from "frontend/actions/fetch-item/robot"
import addItem from "frontend/actions/add-item/robot"
import editItem from "frontend/actions/edit-item/robot"
import removeItem from "frontend/actions/remove-item/robot"
import {updateAddForm, validateAddForm, resetAddForm} from "frontend/actions/form/robot"
import {updateEditForm, validateEditForm, resetEditForm} from "frontend/actions/form/robot"

// TODO: syntax can be simplified with re-exports (wait for proper IDE support)
export {
  // INDEX
  establishIndex, loadIndex, fetchIndex,

  // CRUD
  establishItem, loadItem, fetchItem, addItem, editItem, removeItem,
  updateAddForm, validateAddForm, resetAddForm,
  updateEditForm, validateEditForm, resetEditForm,
}
