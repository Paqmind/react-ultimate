import Tc from "tcomb";

let Uid = Tc.subtype(Tc.String, function (x) {
  return /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(x);
}, "Uid");

export default {
  Uid,
};
