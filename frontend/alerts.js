import {filter, map} from "ramda";
import {ALERT} from "frontend/constants";
import state from "frontend/state";

let $alertQueue = state.select("alertQueue");
let $alertTimeout = state.select("alertTimeout");

function processAlertQueue() {
  if (!$alertTimeout.get()) {
    let alertQueue = $alertQueue.get();
    let expirableAlerts = filter(m => m.expire, alertQueue);
    if (expirableAlerts.length) {
      let alert = expirableAlerts[0];
      let timeout = setTimeout(() => {
        $alertQueue.unset(0);
        $alertTimeout.unset();
        setImmediate(processAlertQueue);
      }, alert.expire === undefined ? (alert.category == "error" ? 0 : 4000) : alert.expire);
      $alertTimeout.set(timeout);
    } else {
      setTimeout(processAlertQueue, ALERT.throttleTimeoutMs);
    }
  }
}

export default {
  processAlertQueue
};
