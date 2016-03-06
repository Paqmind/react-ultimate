import {_updateUIFilters, _updateUISorts, _updateUIPagination} from "frontend/actions/update-ui/index";
import state from "frontend/state";
import {MONSTER} from "shared/constants";


let UICursor = state.select("UI", "monsters");

function updateUIFilters(newFilters) {
  return _updateUIFilters(UICursor, MONSTER, newFilters);
}

function updateUISorts(newSorts) {
  return _updateUISorts(UICursor, MONSTER, newSorts);
}

function updateUIPagination(newOffset, newLimit) {
  return _updateUIPagination(UICursor, MONSTER, newOffset, newLimit);
}

export default {
  updateUIFilters,
  updateUISorts,
  updateUIPagination,
};
