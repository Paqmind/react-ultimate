import DeepMerge from "deep-merge";
import {addIndex, assoc, curry, forEach, filter, pipe, prop, keys, length, map, range, reduce, reverse, slice, sortBy, values} from "ramda";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import flat from "flat";

let mapIndexed = addIndex(map);
let
  reduceIndexed = addIndex(reduce);

function isArray(o) {
  return toString.call(o) === '[object Array]';
}

function isPlainObject(o) {
  return toString.call(o) === '[object Object]';
}

// Workaround until https://github.com/ramda/ramda/issues/1073 (wait for release) //////////////////
let doMerge = DeepMerge((a, b, key) => {
  return b;
});

let merge = curry((a, b) => {
  return doMerge(b, a);
});

let assign = curry((a, b) => {
  return Object.assign({}, b, a);
});
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
  let l = Math.ceil(array.length / n);
  return mapIndexed(
    (x, i) => array.slice(i * n, i * n + n),
    range(0, l)
  );
});

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
    let filterValue = filters[filterKey];
    let filterer = filter(d => d && (d[filterKey] == filterValue));
    return filterer(memo);
  }, data, keys(filters));
});

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
    let sorter;
    if (sort.startsWith("-")) {
      sorter = pipe(sortBy(prop(sort.slice(1))), reverse);
    } else if (sort.startsWith("+") || sort.startsWith(" ")) {
      sorter = sortBy(prop(sort.slice(1)));
    } else {
      sorter = sortBy(prop(sort), true);
    }
    return sorter(memo);
  }, data, reverse(sorts));
});

function flattenObject(object) {
  return flat(object, {safe: true});
}

function unflattenObject(object) {
  return flat.unflatten(object, {object: false});
}

function toObject(array) {
  if (isArray(array)) {
    return reduce((memo, item) => {
      return assoc(item.id, item, memo);
    }, {}, array);
  } else {
    throw Error(`array must be plain Array, got ${array}`);
  }
}

function toArray(object) {
  if (isPlainObject(object)) {
    return sortBy(
      item => item.id,
      map(key => object[key], keys(object))
    );
  } else {
    throw Error(`object must be a plain Object, got ${object}`);
  }
}

function hasValues(object) {
  return pipe(
    flattenObject,
    values,
    filter(x => x !== undefined && x !== null),
    length,
    Boolean
  )(object);
}

export default {
  isArray, isPlainObject,
  merge, assign, chunked, filterByAll, sortByAll,
  flattenObject, unflattenObject,
  toObject, toArray,
  hasValues,
  debounce, throttle,
};
