// INDEX
import loadIndex from "./load-index/monster";
import fetchIndex from "./fetch-index/monster";
import resetIndex from "./reset-index/monster";

// TODO rename to filterIndex, sortIndex, limitIndex, offsetIndex ???
import setIndexFilters from "./set-index-filters/monster";
import setIndexSorts from "./set-index-sorts/monster";
import setIndexOffset from "./set-index-offset/monster";
import setIndexLimit from "./set-index-limit/monster";

// CRUD
import establishModel from "./establish-model/monster";
import loadModel from "./load-model/monster";
import fetchModel from "./fetch-model/monster";
import setModelId from "./set-model-id/monster";
import addModel from "./add-model/monster";
import editModel from "./edit-model/monster";
import removeModel from "./remove-model/monster";

export default {
  // INDEX
  loadIndex, fetchIndex, resetIndex,
  setIndexFilters, setIndexLimit, setIndexOffset, setIndexSorts,

  // CRUD
  establishModel, loadModel, fetchModel, setModelId, addModel, editModel, removeModel,
};