import _addItem from "frontend/actions/add-item/index";
import state from "frontend/state";
import api from "shared/api/robot";
import {Robot} from "shared/types";


export default function addItem() {
  let UICursor = state.select("UI", "robot");
  return _addItem(UICursor, Robot, api);
}
