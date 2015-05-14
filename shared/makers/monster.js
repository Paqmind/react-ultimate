// IMPORTS =========================================================================================
import Faker from "faker";
import {mergeDeep} from "shared/helpers/common";
import Monster from "shared/models/Monster";

// EXPORTS =========================================================================================
export default function makeMonster(manualData={}) {
  // no support to pick name by gender for now in Faker :(
  return Monster(mergeDeep({
    name: Faker.name.findName(),
    birthDate: Faker.date.between("1970-01-01", "1995-01-01"),
    citizenship: Faker.random.array_element(["Russia", "USA", "China"]),
  }, manualData));
}
