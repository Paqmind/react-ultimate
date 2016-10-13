import {findIndex} from "ramda"
import state from "frontend/state"
import {processAlertQueue} from "frontend/alerts"

let alertQueueCursor = state.select("alertQueue")
let alertTimeoutCursor = state.select("alertTimeout")

// Id -> Promise Alert
export default function removeItem(id) {
  let alertQueue = alertQueueCursor.get()
  let i = findIndex(m => m.id == id, alertQueue)
  if (i >= 0) {
    alertQueueCursor.unset(i)
    if (i == 0) {
      clearTimeout(alertTimeoutCursor.get())
      alertTimeoutCursor.unset()
      processAlertQueue()
    }
    return alertQueue[i]
  } else {
    return undefined
  }
}
