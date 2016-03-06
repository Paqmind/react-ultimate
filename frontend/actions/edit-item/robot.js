import _editItem from "frontend/actions/edit-item/index";
import state from "frontend/state";
import api from "shared/api/robot";
import {Robot} from "shared/types";


export default function editItem() {
  let UICursor = state.select("UI", "robot");
  return _editItem(UICursor, Robot, api);
}
