import Faker from "faker";
import {merge} from "shared/helpers/common";
import Robot from "shared/models/robot";

// EXPORTS =========================================================================================
export default function makeRobot(manualData={}) {
  // no support to pick name by gender for now in Faker :(
  return Robot(merge({
    name: Faker.name.firstName(),
    //assemblyDate: Faker.date.between("1970-01-01", "1995-01-01"),
    manufacturer: Faker.random.array_element(["Russia", "USA", "China"]),
  }, manualData));
}
