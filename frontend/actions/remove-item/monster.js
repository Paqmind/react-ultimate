import {indexOf, insert, reject} from "ramda"
import api from "common/api/monster"
import {recommendOffset} from "frontend/helpers/pagination"
import state from "frontend/state"
import {indexRouter} from "frontend/router"
import ajax from "frontend/ajax"
import * as alertActions from "frontend/actions/alert"
import fetchIndex from "frontend/actions/fetch-index/monster"

let urlCursor = state.select("url")
let dataCursor = state.select(api.plural)
let itemsCursor = dataCursor.select("items")

// Id -> Promise Monster
export default function removeItem(id) {
  console.debug(api.plural + `.removeItem(${id})`)

  let {items, pagination} = dataCursor.get()

  // Optimistic update
  let oldItem = items[id]
  let oldIndex = indexOf(id, pagination)

  itemsCursor.unset(id)
  dataCursor.apply("total", t => t ? t - 1 : t)
  dataCursor.apply("pagination", ps => reject(_id => _id == id, ps))

  if (urlCursor.get("route") == api.singular + "-index") {
    setImmediate(() => {
      let {total, offset, limit} = dataCursor.get()

      let recommendedOffset = recommendOffset(total, offset, limit)
      if (offset > recommendedOffset) {
        indexRouter.transitionTo(undefined, {offset: recommendedOffset})
      }
    })
  }

  return ajax.delete(api.itemUrl.replace(":id", id))
    .then(response => {
      let {filters, sorts, offset, limit, pagination} = dataCursor.get()

      if (response.status.startsWith("2")) {
        if (urlCursor.get("route") == api.singular + "-index") {
          if (!pagination[offset + limit - 1]) {
            fetchIndex(filters, sorts, offset + limit - 1, 1)
          }
        }
        return oldItem
      } else {
        itemsCursor.set(id, oldItem)
        dataCursor.apply("total", t => t + 1)
        if (oldIndex != -1) {
          dataCursor.apply("pagination", ps => insert(oldIndex, id, ps))
        }
        alertActions.addItem({message: "Remove Monster failed with message " + response.statusText, category: "error"})
        return undefined
      }
    })
}
