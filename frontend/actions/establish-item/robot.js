import api from "common/api/robot"
import state from "frontend/state"
import loadItem from "frontend/actions/load-item/robot"

let urlCursor = state.select("url")
let dataCursor = state.select(api.plural)

export default function establishItem() {
  console.debug(api.plural + `.establishItem()`)

  dataCursor.set("id", urlCursor.get("params").id)

  return loadItem()
}
