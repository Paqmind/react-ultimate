// INDEX
import establishIndex from "frontend/actions/establish-index/robot";
import loadIndex from "frontend/actions/load-index/robot";
import fetchIndex from "frontend/actions/fetch-index/robot";

// CRUD
import establishItem from "frontend/actions/establish-item/robot";
import loadItem from "frontend/actions/load-item/robot";
import fetchItem from "frontend/actions/fetch-item/robot";
import addItem from "frontend/actions/add-item/robot";
import editItem from "frontend/actions/edit-item/robot";
import removeItem from "frontend/actions/remove-item/robot";

export default {
  // INDEX
  establishIndex, loadIndex, fetchIndex,

  // CRUD
  establishItem, loadItem, fetchItem, addItem, editItem, removeItem,
};
