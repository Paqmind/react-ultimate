import {findIndex} from "ramda";
import state from "frontend/state";
import {processAlertQueue} from "frontend/alerts";

let $alertQueue = state.select("alertQueue");
let $alertTimeout = state.select("alertTimeout");

// Id -> Maybe Alert
export default function removeItem(id) {
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
    return undefined;
  }
}
