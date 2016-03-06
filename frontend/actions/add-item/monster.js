import _addItem from "frontend/actions/add-item/index";
import state from "frontend/state";
import api from "shared/api/monster";
import {Monster} from "shared/types";


export default function addItem() {
  let UICursor = state.select("UI", "monster");
  return _addItem(UICursor, Monster, api);
}
