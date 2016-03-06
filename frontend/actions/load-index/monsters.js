import _loadIndex from "frontend/actions/load-index/index";
import state from "frontend/state";
import api from "shared/api/monster";
import {Monster} from "shared/types";


export default function loadItems() {
  let UICursor = state.select("UI", "monsters");
  return _loadIndex(UICursor, Monster, api);
}
