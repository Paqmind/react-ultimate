// INDEX
import establishIndex from "./establish-index/robot";
import loadIndex from "./load-index/robot";
import fetchIndex from "./fetch-index/robot";

// CRUD
import establishModel from "./establish-model/robot";
import loadModel from "./load-model/robot";
import fetchModel from "./fetch-model/robot";
import addModel from "./add-model/robot";
import editModel from "./edit-model/robot";
import removeModel from "./remove-model/robot";

export default {
  // INDEX
  establishIndex, loadIndex, fetchIndex,

  // CRUD
  establishModel, loadModel, fetchModel, addModel, editModel, removeModel,
};
