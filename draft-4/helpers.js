let {curry} = require("ramda");

exports.always = curry((x, y) => x);

exports.scanFn = curry((state, updateFn) => {
  if (typeof updateFn != "function" || updateFn.length != 1) {
    throw Error("updateFn must be function of arity 1")
  } else {
    return updateFn(state);
  }
});