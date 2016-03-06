import _loadItem from "frontend/actions/load-item/index";
import state from "frontend/state";
import api from "shared/api/monster";
import {Monster} from "shared/types";


export default function loadItem(id) {
  let UICursor = state.select("UI", "monster");
  UICursor.set("id", id);
  return _loadItem(UICursor, Monster, api);
}
