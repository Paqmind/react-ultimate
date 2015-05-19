// IMPORTS =========================================================================================
import {map} from "ramda";

// SHIMS ===========================================================================================
// How it's ever missed?!
RegExp.escape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// TODO investigate this crap further
// let process = process || undefined;
//if (process) {
  // IoJS has `unhandledRejection` hook
  //process.on("unhandledRejection", function (reason, p) {
  //  throw Error(`UnhandledRejection: ${reason}`);
  //});
//} else {
//  Promise.prototype.done = function done(resolve, reject) {
//    this
//      .then(resolve, reject)
//      .catch(e => {
//        setTimeout(() => { throw e; }, 0);
//      });
//  };
//}
