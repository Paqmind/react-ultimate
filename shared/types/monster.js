import {dissoc} from "ramda";
import Tc from "tcomb";
import {Uid} from "./common";

let Name = Tc.subtype(Tc.String, x => {
  return x.length >= 2;
});

let Citizenship = Tc.enums.of(["China", "Russia", "USA"], "Citizenship");

let MonsterType = {
  id: Uid,
  name: Name,
  citizenship: Citizenship,
  birthDate: Tc.Date,
};

export default {
  Monster: Tc.struct(MonsterType, "Monster"),
  AlmostMonster: Tc.struct(dissoc("id", MonsterType), "AlmostMonster"),
};
