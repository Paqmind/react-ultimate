import _loadItem from "frontend/actions/load-item/index";
import state from "frontend/state";
import api from "shared/api/robot";
import {Robot} from "shared/types";


export default function loadItem(id) {
  let UICursor = state.select("UI", "robot");
  UICursor.set("id", id);
  return _loadItem(UICursor, Robot, api);
}
