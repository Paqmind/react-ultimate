import _editItem from "frontend/actions/edit-item/index";
import state from "frontend/state";
import api from "shared/api/monster";
import {Monster} from "shared/types";


export default function editItem() {
  let UICursor = state.select("UI", "monster");
  return _editItem(UICursor, Monster, api);
}
