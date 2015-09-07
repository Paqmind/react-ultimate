import Faker from "faker";
import {merge} from "shared/helpers/common";
import Monster from "shared/models/monster";

// EXPORTS =========================================================================================
export default function makeMonster(manualData={}) {
  // no support to pick name by gender for now in Faker :(
  return Monster(merge(manualData, {
    name: Faker.name.findName(),
    //birthDate: Faker.date.between("1970-01-01", "1995-01-01"),
    citizenship: Faker.random.arrayElement(["Russia", "USA", "China"]),
  }));
}
