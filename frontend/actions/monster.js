// INDEX
import loadIndex from "frontend/actions/load-index/monster"
import fetchIndex from "frontend/actions/fetch-index/monster"

// CRUD
import establishItem from "frontend/actions/establish-item/monster"
import loadItem from "frontend/actions/load-item/monster"
import fetchItem from "frontend/actions/fetch-item/monster"
import addItem from "frontend/actions/add-item/monster"
import editItem from "frontend/actions/edit-item/monster"
import removeItem from "frontend/actions/remove-item/monster"
import {updateAddForm, validateAddForm, resetAddForm} from "frontend/actions/form/monster"
import {updateEditForm, validateEditForm, resetEditForm} from "frontend/actions/form/monster"

// TODO: syntax can be simplified with re-exports (wait for proper IDE support)
export {
  // INDEX
  loadIndex, fetchIndex,

  // CRUD
  establishItem, loadItem, fetchItem, addItem, editItem, removeItem,
  updateAddForm, validateAddForm, resetAddForm,
  updateEditForm, validateEditForm, resetEditForm,
}
