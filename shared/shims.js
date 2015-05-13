// IMPORTS =========================================================================================
import {map} from "ramda";
import Inspect from "util-inspect";

// SHIMS ===========================================================================================
// How it's ever missed?!
RegExp.escape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Uncomment if use IoJS
// let process = process || undefined;
//if (process) {
  // IoJS has `unhandledRejection` hook
  //process.on("unhandledRejection", function (reason, p) {
  //  throw Error(`UnhandledRejection: ${reason}`);
  //});
//} else {
  Promise.prototype.done = function done(resolve, reject) {
    this
      .then(resolve, reject)
      .catch(e => {
        setTimeout(() => { throw e; }, 0);
      });
  };
//}

// Workaround method as native browser string representation of Immutable is awful
let window = window || undefined;
if (window) {
  window.console.echo = function echo() {
    console.log.apply(console, map(v => Inspect(v), Array.prototype.slice.call(arguments)));
  };
}