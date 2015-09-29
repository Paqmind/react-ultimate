import Tc from "tcomb";
import {Uid} from "./common";

let MonsterName = Tc.subtype(Tc.String, x => {
  return x.length >= 2 && x.length <= 100;
});

let MonsterCitizenship = Tc.enums.of(["China", "Russia", "USA"], "MonsterCitizenship");

let AlmostMonster = Tc.struct({
  name: MonsterName,
  citizenship: MonsterCitizenship,
  birthDate: Tc.Date,
}, "AlmostMonster");

let Monster = AlmostMonster.extend({
  id: Uid,
}, "Monster");

export default {
  AlmostMonster, Monster,
};
