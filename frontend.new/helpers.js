let {curry, filter, identity, pipe, prop, reverse, slice, sortBy, tail, values, whereEq} = require("ramda");

// always :: a -> b -> a
exports.always = curry((x, y) => x);

// index :: [a] -> {*} -> String -> Number -> Number -> [a]
exports.index = curry((models, filters, sort, offset, limit) => {
  let postSort = sort.startsWith("+") ? identity : reverse;
  return pipe(
    filter(whereEq(filters)),
    sortBy(prop(tail(sort))),
    postSort,
    slice(offset, offset + limit)
  )(models);
});

// DEPRECATED:
// exports.adjustBy = curry((pred, adjustFn, array) => {
//   let i = findIndex(pred, array);
//   if (i >= 0) {
//     return adjust(adjustFn, i, array);
//   } else {
//     return array;
//   }
// });

// RECOMMENDED (very close):
// map(when(whereEq({id: "1"}), flip(merge)({name: "FOO"})));