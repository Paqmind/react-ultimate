import {sortBy, list, vector, equals, isSeq, hashMap, take, range, get, concat, vec, intoArray, cons} from "mori";

console.log(
  sortBy(model => model.name, [{name: "jac"}, {name: "jab"}])
)

//console.log(get(vector(1, 2, 3), 1));

//console.log(
//  hashMap("1", "2", "3", "4")
//);
//
//console.log(
//  hashMap(...["1", "2", "3", "4"])
//);
//
//console.log(
//  hashMap(...vector("1", "2", "3", "4"))
//);
//
//console.log(
//  hashMap(...list("1", "2", "3", "4"))
//);

//var l0 = mori.list(1,2,3);
//var l1 = mori.list(1,2,3);
//mori.equals(l0, l1); // => true

//console.log(equals(list(1, 2, 3), list(1, 2, 3)));
//console.log(isSeq(list(4, 5, 6)));
//console.log(isSeq(vector(1)));

//let x = hashMap("x", "X",
//                "y", "Y");

//console.log(x);
//console.log(get(x, "x"));

//console.log(
//  vector.apply(null, intoArray(cons("a", vector("b", "c"))))
  //vector(...intoArray(concat("a", vector("b", "c"))))
  //vector(...intoArray(concat("a", vector("b", "c"))))
  //vector(...cons("a", vector("b", "c")))
//);

//console.log(
//  vec(concat("a", vector("b", "c")))
//);