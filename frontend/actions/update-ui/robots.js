import {_updateUIFilters, _updateUISorts, _updateUIPagination} from "frontend/actions/update-ui/index";
import state from "frontend/state";
import {ROBOT} from "shared/constants";


let UICursor = state.select("UI", "robots");

function updateUIFilters(newFilters) {
  return _updateUIFilters(UICursor, ROBOT, newFilters);
}

function updateUISorts(newSorts) {
  return _updateUISorts(UICursor, ROBOT, newSorts);
}

function updateUIPagination(newOffset, newLimit) {
  return _updateUIPagination(UICursor, ROBOT, newOffset, newLimit);
}

export default {
  updateUIFilters,
  updateUISorts,
  updateUIPagination,
};
