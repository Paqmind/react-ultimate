import {findIndex} from "ramda";
import state from "frontend/state";
import {processAlertQueue} from "frontend/alerts";

// CURSORS =========================================================================================
let $alertQueue = state.select("alertQueue");
let $alertTimeout = state.select("alertTimeout");

// ACTIONS =========================================================================================
// Id -> Maybe Model
export default function removeModel(id) {
  let alertQueue = $alertQueue.get();
  let i = findIndex(m => m.id == id, alertQueue);
  if (i >= 0) {
    $alertQueue.unset(i);
    if (i == 0) {
      clearTimeout($alertTimeout.get());
      $alertTimeout.unset();
      processAlertQueue();
    }
    return alertQueue[i];
  } else {
    return;
  }
}
