// INDEX
import loadIndex from "frontend/actions/load-index/index";
import updateUI from "frontend/actions/load-index/update-ui";

import loadItem from "frontend/actions/load-item/index";
import addItem from "frontend/actions/add-item/index";

import {updateAddForm, validateAddForm, resetAddForm} from "frontend/actions/form/index";
import {updateEditForm, validateEditForm, resetEditForm} from "frontend/actions/form/index";

export default {
  // INDEX
  loadIndex, updateUI,

  // CRUD
  loadItem,
  addItem,
  // editItem, removeItem,
  updateAddForm, validateAddForm, resetAddForm,
  updateEditForm, validateEditForm, resetEditForm,
};
