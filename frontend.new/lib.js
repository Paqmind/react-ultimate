let {curry} = require("ramda");
let {Observable, Subject} = require("rx");
let {index} = require("./helpers");

// scanFn :: s -> (s -> s) -> s
let scanFn = curry((state, updateFn) => {
  if (typeof updateFn != "function" || updateFn.length != 1) {
    throw Error("updateFn must be a function of arity 1")
  } else {
    return updateFn(state);
  }
});

// store :: s -> Observable (f -> f)
exports.store = curry((seed, update) => {
  return update
    .startWith(seed)
    .scan(scanFn)
    .shareReplay(1)
    .distinctUntilChanged();
});

// indexView :: Observable [m] -> {filters, sort, offset, limit} -> Observable [m]
exports.indexView = curry((models, {filters, sort, offset, limit}) => {
  return models
    .combineLatest(filters, sort, offset, limit, index)
    .distinctUntilChanged();
});