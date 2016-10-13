import {append, keys, filter, find, map, pipe, slice, range, reject, reverse, values} from "ramda"
import {chunked, filterByAll, sortByAll} from "common/helpers/common"

export function inCache(offset, limit, total, pagination) {
  let cache = filter(v => v, slice(offset, offset + limit, pagination))
  if (cache.length) {
    if (offset == recommendOffset(total, total, limit)) {
      // last page
      let totalPages = getTotalPages(total, limit)
      return cache.length >= limit - ((totalPages * limit) - total)
    } else {
      // not last page
      return cache.length >= limit
    }
  } else {
    return false
  }
}

export function recommendOffset(total, offset, limit) {
  if (typeof total != "number" || total < 0) {
    throw Error(`total must be natural number, got ${total}`)
  }
  if (typeof offset != "number" || offset < 0) {
    throw Error(`offset must be natural number, got ${offset}`)
  }
  if (typeof limit != "number" || limit <= 0) {
    throw Error(`limit must be positive number, got ${limit}`)
  }

  if (total == 0) {
    return offset
  } else {
    let totalPages = getTotalPages(total, limit)
    let lastOffset
    if (totalPages <= 1) {
      lastOffset = 0
    } else {
      lastOffset = (totalPages - 1)  * limit
    }

    let possibleOffsets = reject(
      _offset => _offset % limit,   // reject everything but 0, 5, 10, 15... for limit = 5
      range(0, lastOffset + limit)  // from this range
    )

    return find(_offset => _offset <= offset, reverse(possibleOffsets)) // can't be undefined with all the code above
  }
}

export function getTotalPages(total, limit) {
  if (typeof total != "number" || total < 0) {
    throw Error(`total must be natural number, got ${total}`)
  }
  if (typeof limit != "number" || limit <= 0) {
    throw Error(`limit must be positive number, got ${limit}`)
  }
  return Math.ceil(total / limit)
}
