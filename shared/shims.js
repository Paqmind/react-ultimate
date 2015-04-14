// IMPORTS =========================================================================================
let Inspect = require("util-inspect");

require("babel/polyfill");

// SHIMS ===========================================================================================
// How it's ever missed?!
RegExp.escape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Super required method, bored to import `lodash.range`
// `Array.range(5)` => [0, 1, 2, 3, 4]
Array.range = function range(n) {
  return Array.apply(null, new Array(n)).map((x, i) => i);
};

// Required for pagination
// `Array.chunked([1, 2, 3, 4, 5], 2)` => [[1, 2], [3, 4], [5]]
Array.chunked = function chunked(array, n) {
  let l = Math.ceil(array.length / n);
  return Array.range(l).map((x, i) => array.slice(i*n, i*n + n));
};

if (process) {
  // IOJS has `unhandledRejection` hook
  process.on("unhandledRejection", function (reason, p) {
    throw Error(`UnhandledRejection: ${reason}`);
  });
} else {
  // BROWSER (Canary logs unhandled exceptions others just swallow)
  Promise.prototype.done = function (resolve, reject) {
    this
      .then(resolve, reject)
      .catch(function (e) {
        setTimeout(function () { throw e; }, 1);
      });
  };

  // Workaround method as native browser string representation of Immutable is awful
  window.console.echo = function log() {
    console.log.apply(console, Array.prototype.slice.call(arguments).map(v => Inspect(v)));
  };
}