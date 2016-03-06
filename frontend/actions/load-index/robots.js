import _loadIndex from "frontend/actions/load-index/index";
import state from "frontend/state";
import api from "shared/api/robot";
import {Robot} from "shared/types";


export default function loadItems() {
  let UICursor = state.select("UI", "robots");
  return _loadIndex(UICursor, Robot, api);
}
