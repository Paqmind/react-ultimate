// INDEX
import establishIndex from "./establish-index/robot";
import loadIndex from "./load-index/robot";
import fetchIndex from "./fetch-index/robot";
import resetIndex from "./reset-index/robot";

// TODO rename to filterIndex, sortIndex, limitIndex, offsetIndex ???
import setIndexFilters from "./set-index-filters/robot";
import setIndexSorts from "./set-index-sorts/robot";
import setIndexOffset from "./set-index-offset/robot";
import setIndexLimit from "./set-index-limit/robot";

// CRUD
import establishModel from "./establish-model/robot";
import loadModel from "./load-model/robot";
import fetchModel from "./fetch-model/robot";
import viewModel from "./view-model/robot";
import addModel from "./add-model/robot";
import editModel from "./edit-model/robot";
import removeModel from "./remove-model/robot";

export default {
  // INDEX
  establishIndex, loadIndex, fetchIndex, resetIndex,
  setIndexFilters, setIndexLimit, setIndexOffset, setIndexSorts,

  // CRUD
  establishModel, loadModel, fetchModel, viewModel, addModel, editModel, removeModel,
};