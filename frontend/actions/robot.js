// INDEX
import establishIndex from "frontend/actions/establish-index/robot";
import loadIndex from "frontend/actions/load-index/robot";
import fetchIndex from "frontend/actions/fetch-index/robot";

// CRUD
import establishModel from "frontend/actions/establish-model/robot";
import loadModel from "frontend/actions/load-model/robot";
import fetchModel from "frontend/actions/fetch-model/robot";
import addModel from "frontend/actions/add-model/robot";
import editModel from "frontend/actions/edit-model/robot";
import removeModel from "frontend/actions/remove-model/robot";

export default {
  // INDEX
  establishIndex, loadIndex, fetchIndex,

  // CRUD
  establishModel, loadModel, fetchModel, addModel, editModel, removeModel,
};
