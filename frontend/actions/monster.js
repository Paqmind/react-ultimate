// INDEX
import loadIndex from "frontend/actions/load-index/monster";
import fetchIndex from "frontend/actions/fetch-index/monster";

// CRUD
import establishModel from "frontend/actions/establish-model/monster";
import loadModel from "frontend/actions/load-model/monster";
import fetchModel from "frontend/actions/fetch-model/monster";
import addModel from "frontend/actions/add-model/monster";
import editModel from "frontend/actions/edit-model/monster";
import removeModel from "frontend/actions/remove-model/monster";

export default {
  // INDEX
  loadIndex, fetchIndex,

  // CRUD
  establishModel, loadModel, fetchModel, addModel, editModel, removeModel,
};
