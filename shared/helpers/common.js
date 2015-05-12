// IMPORTS =========================================================================================
import {keys, filter, pipe, prop, map, range, reduce, reverse, sortBy} from "ramda";
import flat from "flat";

// HELPERS =========================================================================================
/**
 * Split array into chunks with predefined chunk length. Useful for pagination.
 * Example:
 *   chunked([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]]
 * @pure
 * @param array {Array} - array to be chunked
 * @param n {number} - length of chunk
 * @returns {Array} - chunked array
 */
export function chunked(array, n) {
  let l = Math.ceil(array.length / n);
  return map(
    (x, i) => array.slice(i * n, i * n + n),
    range(0, l)
  );
}

/**
 * Sort array by `sorts` argument
 * @pure
 * @param sorts {Array<string>} - array in format ["+name", "-age"]
 * @param data {Array<*>} - unsorted data
 * @returns {Array<*>} - sorted data
 */
export function sortByAll(sorts, data) {
  return reduce((data, sort) => {
    let sorter;
    if (sort.startsWith("-")) {
      sorter = pipe(sortBy(prop(sort.slice(1))), reverse);
    } else if (sort.startsWith("+")) {
      sorter = sortBy(prop(sort.slice(1)));
    } else {
      sorter = sortBy(prop(sort));
    }
    return sorter(data);
  }, data, sorts);
}

export function flattenArrayObject(object, sorter=(v => v)) {
  let sortedKeys = sortBy(sorter, keys(object));
  return reduce((combinedArray, key) => {
    return combinedArray.concat(object[key]);
  }, [], sortedKeys);
}

export function flattenObject(obj) {
  return flat(obj, {safe: true});
}

export function unflattenObject(obj) {
  return flat.unflatten(obj, {object: false});
}

export function toObject(array) {
  if (array instanceof Array) {
    return reduce((object, item) => {
      object[item.id] = item;
      return object;
    }, {}, array);
  } else {
    throw Error(`array must be plain Array, got ${array}`);
  }
}

export function toArray(object) {
  if (object instanceof Object) {
    return sortBy(
      item => item.id,
      map(key => object[key], keys(object))
    );
  } else {
    throw Error(`object must be a basic Object, got ${object}`);
  }
}

export function normalize(data) {
  if (data instanceof Array) {
    return map(v => normalize(v), data);
  } else if (data instanceof Object) {
    return reduce((obj, k) => {
      if (k.includes(".")) {
        let kk = k.split(".");
        obj[kk[0]] = normalize({[kk.slice(1).join(".")]: data[k]});
      } else {
        obj[k] = normalize(data[k]);
      }
      return obj;
    }, {}, keys(data));
  } else if (typeof data == "string") {
    if (data === "false") {
      return false;
    } else if (data === "true") {
      return true;
    } else if (data === "undefined") {
      return undefined;
    } else if (data === "null") {
      return null;
    } else if (data.match(/^-?\d+\.\d+/)) {
      return parseFloat(data);
    } else if (data.match(/^-?\d+/)) {
      return parseInt(data);
    } else {
      return data;
    }
  } else {
    return data;
  }
}