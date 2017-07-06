import {assoc} from "ramda"
import UUID from "uuid"
import {ALERT} from "common/constants"
import {Alert} from "common/types"
import {parseAs} from "common/parsers"
import state from "frontend/state"

let alertQueueCursor = state.select("alertQueue")

// Object -> Promise Alert
export default function addItem(data) {
  data = assoc("id", data.id || UUID.v4(), data)
  if (data.closable === undefined) {
    data.closable = data.category === "error" ? false : true
  }
  if (data.expire === undefined) {
    data.expire = data.category == "error" ? 0 : ALERT.expire
  }
  let item = parseAs(Alert, data)
  alertQueueCursor.push(item)
  return Promise.resolve(item)
}
