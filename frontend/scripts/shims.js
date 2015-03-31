let Inspect = require("util-inspect");
require("babel/polyfill");

Promise.prototype.done = function (onFulfilled, onRejected) {
  this
    .then(onFulfilled, onRejected)
    .catch(function (e) {
      setTimeout(function () { throw e; }, 1);
    });
};

window.console.echo = function log() {
  console.log.apply(console, Array.prototype.slice.call(arguments).map(v => Inspect(v)));
};