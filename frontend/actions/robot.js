// INDEX
import establishIndex from "frontend/scripts/actions/establish-index/robot";
import loadIndex from "frontend/scripts/actions/load-index/robot";
import fetchIndex from "frontend/scripts/actions/fetch-index/robot";

// CRUD
import establishModel from "frontend/scripts/actions/establish-model/robot";
import loadModel from "frontend/scripts/actions/load-model/robot";
import fetchModel from "frontend/scripts/actions/fetch-model/robot";
import addModel from "frontend/scripts/actions/add-model/robot";
import editModel from "frontend/scripts/actions/edit-model/robot";
import removeModel from "frontend/scripts/actions/remove-model/robot";

export default {
  // INDEX
  establishIndex, loadIndex, fetchIndex,

  // CRUD
  establishModel, loadModel, fetchModel, addModel, editModel, removeModel,
};
