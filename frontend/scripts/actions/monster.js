import add from "./add/monster";
import edit from "./edit/monster";
import fetchIndex from "./fetch-index/monster";
import fetchModel from "./fetch-model/monster";
import loadIndex from "./load-index/monster";
import loadModel from "./load-model/monster";
import remove from "./remove/monster";
import reset from "./reset/monster";
import setFilters from "./set-filters/monster";
import setId from "./set-id/monster";
import setLimit from "./set-limit/monster";
import setOffset from "./set-offset/monster";
import setSorts from "./set-sorts/monster";

export default {
  add, edit, remove, reset,
  loadIndex, loadModel,
  fetchIndex, fetchModel,
  setFilters, setId, setLimit, setOffset, setSorts,
};