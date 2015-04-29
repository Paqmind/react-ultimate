import Immutable from "seamless-immutable";

let x = Immutable([1, 2, {a: "A"}]);

x = x.concat([3]);

x.push("B");

console.log(x);