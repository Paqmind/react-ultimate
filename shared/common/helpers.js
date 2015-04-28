// IMPORTS =========================================================================================
import range from "lodash.range";

// HELPERS =========================================================================================
// `chunked([1, 2, 3, 4, 5], 2)` => [[1, 2], [3, 4], [5]]
export function chunked(array, n) {
  let l = Math.ceil(array.length / n);
  return range(l).map((x, i) => array.slice(i*n, i*n + n));
}