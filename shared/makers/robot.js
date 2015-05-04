// IMPORTS =========================================================================================
import Faker from "faker";
import Robot from "shared/models/Robot";

// EXPORTS =========================================================================================
export default function makeRobot(manualData) {
  // no support to pick name by gender for now in Faker :(
  return Robot(Object.assign({
    name: Faker.name.firstName(),
    assemblyDate: Faker.date.between("1970-01-01", "1995-01-01"),
    manufacturer: Faker.random.array_element(["Russia", "USA", "China"]),
  }, manualData));
}
