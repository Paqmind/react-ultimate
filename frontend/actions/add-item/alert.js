import Alert from "shared/items/alert";
import state from "frontend/state";

// CURSORS =========================================================================================
let $alertQueue = state.select("alertQueue");

// ACTIONS =========================================================================================
// Object -> Maybe Alert
export default function addAlert(item) {
  item = Alert(item);
  $alertQueue.push(item);
  return Promise.resolve(item);
}
