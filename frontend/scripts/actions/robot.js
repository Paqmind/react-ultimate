import add from "./add/robot";
import edit from "./edit/robot";
import establishIndex from "./establish-index/robot";
import establishModel from "./establish-model/robot";
import fetchIndex from "./fetch-index/robot";
import fetchModel from "./fetch-model/robot";
import loadIndex from "./load-index/robot";
import loadModel from "./load-model/robot";
import remove from "./remove/robot";
import reset from "./reset/robot";
import setFilters from "./set-filters/robot";
import setId from "./set-id/robot";
import setLimit from "./set-limit/robot";
import setOffset from "./set-offset/robot";
import setSorts from "./set-sorts/robot";

export default {
  add, edit, remove, reset,
  establishIndex, establishModel,
  loadIndex, loadModel,
  fetchIndex, fetchModel,
  setFilters, setId, setLimit, setOffset, setSorts,
};