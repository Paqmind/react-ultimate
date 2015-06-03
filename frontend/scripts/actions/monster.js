// INDEX
import loadIndex from "frontend/scripts/actions/load-index/monster";
import fetchIndex from "frontend/scripts/actions/fetch-index/monster";

// CRUD
import establishModel from "frontend/scripts/actions/establish-model/monster";
import loadModel from "frontend/scripts/actions/load-model/monster";
import fetchModel from "frontend/scripts/actions/fetch-model/monster";
import addModel from "frontend/scripts/actions/add-model/monster";
import editModel from "frontend/scripts/actions/edit-model/monster";
import removeModel from "frontend/scripts/actions/remove-model/monster";

export default {
  // INDEX
  loadIndex, fetchIndex,

  // CRUD
  establishModel, loadModel, fetchModel, addModel, editModel, removeModel,
};
