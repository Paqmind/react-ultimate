// IMPORTS =========================================================================================
import isArray from "lodash.isarray";
import range from "lodash.range";
import merge from "lodash.merge";

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
  return range(l).map((x, i) => array.slice(i*n, i*n + n));
}

/**
 * Converts sorting array in "short" format to sorting array in "lodash" (lodash.sortByOrder) format.
 * Example:
 *   lodashifySorts(["+name", "-age"]) == [["name", "age"], [true, false]]
 * @pure
 * @param sorts {Array<string>} - array in "short" format
 * @returns {Array<Array<string>>} - array in "lodash" format
 */
export function lodashifySorts(sorts) {
  return [
    sorts.map(v => v.slice(1)),
    sorts.map(v => v[0] == "+"),
  ];
}

export function mergeDeep(object, other) {
  return merge({}, object, other, (a, b) => {
    if (isArray(a)) {
      return a.concat(b);
    }
  });
}
