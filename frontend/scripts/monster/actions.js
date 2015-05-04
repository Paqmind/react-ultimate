import fetchModel from "./actions/fetch-model";
import fetchIndex from "./actions/fetch-index";

import loadModel from "./actions/load-model";
import loadIndex from "./actions/load-index";

import setPagination from "./actions/set-pagination";
import setFilters from "./actions/set-filters";
import setSorts from "./actions/set-sorts";
import setOffset from "./actions/set-offset";
import setLimit from "./actions/set-limit";
import setId from "./actions/set-id";

import add from "./actions/add";
import edit from "./actions/edit";
import remove from "./actions/remove";

export default {
  fetchModel, fetchIndex,
  loadModel, loadIndex,
  setPagination, setFilters, setSorts, setOffset, setLimit, setId,
  add, edit, remove,
}