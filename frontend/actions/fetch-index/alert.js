import {map} from "ramda"
import {toObject} from "common/helpers/common"
import {formatQueryForAxios} from "common/helpers/jsonapi"
import api from "common/api/alert"
import {Alert} from "common/types"
import state from "frontend/state"
import ajax from "frontend/ajax"

let alertQueueCursor = state.select("alertQueue")

// Filters, Sorts, Offset, Limit -> Promise [Alert]
export default function fetchIndex(filters, sorts, offset, limit) {
  console.debug(api.plural + ".fetchIndex(...)")

  let query = formatQueryForAxios({filters, sorts, offset, limit})

  return ajax.get(api.indexUrl, {params: query})
    .then(response => {
      if (response.status.startsWith("2")) {
        let newItems = map(m => Alert(m), response.data.data)
        alertQueueCursor.concat(newItems)
        return newItems
      } else {
        return []
      }
    })
}
