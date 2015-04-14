// IMPORTS =========================================================================================
let Inspect = require("util-inspect");

require("babel/polyfill");

// SHIMS ===========================================================================================
// How it's ever missed?!
RegExp.escape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// (c) Lodash. Super required method, bored to import this
Array.range = function range(start, end, step) {
  if (step && isIterateeCall(start, end, step)) {
    end = step = null;
  }
  start = +start || 0;
  step = step == null ? 1 : (+step || 0);

  if (end == null) {
    end = start;
    start = 0;
  } else {
    end = +end || 0;
  }
  // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
  // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
  var index = -1,
      length = Math.max(Math.ceil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (++index < length) {
    result[index] = start;
    start += step;
  }
  return result;
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