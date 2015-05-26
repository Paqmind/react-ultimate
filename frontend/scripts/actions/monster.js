// INDEX
import loadIndex from "./load-index/monster";
import fetchIndex from "./fetch-index/monster";

// CRUD
import establishModel from "./establish-model/monster";
import loadModel from "./load-model/monster";
import fetchModel from "./fetch-model/monster";
import addModel from "./add-model/monster";
import editModel from "./edit-model/monster";
import removeModel from "./remove-model/monster";

export default {
  // INDEX
  loadIndex, fetchIndex,

  // CRUD
  establishModel, loadModel, fetchModel, addModel, editModel, removeModel,
};
