let DeepMerge = require("deep-merge")
let {addIndex, assoc, curry, forEach, filter, pipe, prop, keys, length, map, range, reduce, reverse, slice, sortBy, values} = require("ramda")
let debounce = require("lodash.debounce")
let throttle = require("lodash.throttle")
let flat = require("flat")

let mapIndexed = addIndex(map)
let reduceIndexed = addIndex(reduce)

function isArray(o) {
  return toString.call(o) === '[object Array]'
}

function isPlainObject(o) {
  return toString.call(o) === '[object Object]'
}

let doMerge = DeepMerge((x, y, key) => y)
let merge = curry((x, y) => doMerge(x, y))
let assign = curry((x, y) => Object.assign({}, x, y))
////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Split array into chunks with predefined chunk length. Useful for pagination.
 * Example:
 *   chunked([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]]
 * @pure
 * @curry
 * @param array {Array} - array to be chunked
 * @param n {number} - length of chunk
 * @return {Array} - chunked array
 */
let chunked = curry((n, array) => {
  let l = Math.ceil(array.length / n)
  return mapIndexed(
    (x, i) => array.slice(i * n, i * n + n),
    range(0, l)
  )
})

/**
 * Filter array by `filters` argument
 * @pure
 * @curry
 * @param filters {Object<string, *>} - filters, e.g. {age: 30}
 * @param data {Array<*>} - unsorted data
 * @return {Array<*>} - sorted data
 */
let filterByAll = curry((filters, data) => {
  return reduce((memo, filterKey) => {
    let filterValue = filters[filterKey]
    let filterer = filter(d => d && (d[filterKey] == filterValue))
    return filterer(memo)
  }, data, keys(filters))
})

/**
 * Sort array by `sorts` argument
 * @pure
 * @curry
 * @param sorts {Array<string>} - sorts, e.g. ["+name", "-age"]
 * @param data {Array<*>} - unsorted data
 * @returns {Array<*>} - sorted data
 */
let sortByAll = curry((sorts, data) => {
  return reduce((memo, sort) => {
    let sorter
    if (sort.startsWith("-")) {
      sorter = pipe(sortBy(prop(sort.slice(1))), reverse)
    } else if (sort.startsWith("+") || sort.startsWith(" ")) {
      sorter = sortBy(prop(sort.slice(1)))
    } else {
      sorter = sortBy(prop(sort), true)
    }
    return sorter(memo)
  }, data, reverse(sorts))
})

function flattenObject(object) {
  return flat(object, {safe: true})
}

function unflattenObject(object) {
  return flat.unflatten(object, {object: false})
}

function toObject(array) {
  if (isArray(array)) {
    return reduce((memo, item) => {
      return assoc(item.id, item, memo)
    }, {}, array)
  } else {
    throw Error(`array must be plain Array, got ${array}`)
  }
}

function toArray(object) {
  if (isPlainObject(object)) {
    return sortBy(
      item => item.id,
      map(key => object[key], keys(object))
    )
  } else {
    throw Error(`object must be plain Object, got ${object}`)
  }
}

function hasValues(object) {
  return pipe(
    flattenObject,
    values,
    filter(x => x !== undefined && x !== null),
    length,
    Boolean
  )(object)
}

function getRandomBetween(min=0, max=100) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
  isArray, isPlainObject,
  merge, assign, chunked, filterByAll, sortByAll,
  flattenObject, unflattenObject,
  toObject, toArray,
  hasValues,
  debounce, throttle,
  getRandomBetween,
}


