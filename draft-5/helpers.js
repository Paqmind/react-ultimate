let {curry} = require("ramda");

exports.always = curry((x, y) => x);

exports.scanFn = curry((state, updateFn) => {
  if (typeof updateFn != "function" || updateFn.length != 1) {
    throw Error("updateFn must be function of arity 1")
  } else {
    return updateFn(state);
  }
});

exports.reducer = curry((init, scanFnObservable) => {
  return scanFnObservable
    .startWith(init)
    .scan(exports.scanFn)
    .shareReplay(1)
    .distinctUntilChanged();
});