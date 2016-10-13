import api from "common/api/robot"
import {Robot} from "common/types"
import {parseAs} from "common/parsers"
import state from "frontend/state"
import ajax from "frontend/ajax"

let dataCursor = state.select(api.plural)
let itemsCursor = dataCursor.select("items")

// Object -> Promise Robot
export default function editItem(data) {
  console.debug(api.plural + `.editItem(${data.id})`)

  let item = parseAs(Robot, data)
  let id = item.id

  // Optimistic update
  let oldItem = itemsCursor.get(id)
  itemsCursor.set(id, item)

  return ajax.put(api.itemUrl.replace(":id", id), item)
    .then(response => {
      if (response.status.startsWith("2")) {
        if (response.status == "200" && response.data.data) {
          item = itemsCursor.set(id, parseAs(Robot, response.data.data))
        }
        return item
      } else {
        itemsCursor.set(id, oldItem)
        throw Error(response.statusText)
      }
    })
}
