import {filter, map} from "ramda"
import {ALERT} from "common/constants"
import state from "frontend/state"

let alertQueueCursor = state.select("alertQueue")
let alertTimeoutCursor = state.select("alertTimeout")

export function processAlertQueue() {
  if (!alertTimeoutCursor.get()) {
    let alertQueue = alertQueueCursor.get()
    let expirableAlerts = filter(m => m.expire, alertQueue)
    if (expirableAlerts.length) {
      let alert = expirableAlerts[0]
      let timeout = setTimeout(() => {
        alertQueueCursor.unset(0)
        alertTimeoutCursor.unset()
        setImmediate(processAlertQueue)
      }, alert.expire)
      alertTimeoutCursor.set(timeout)
    } else {
      setTimeout(processAlertQueue, ALERT.throttleTimeoutMs)
    }
  }
}
