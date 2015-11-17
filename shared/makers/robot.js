import UUID from "node-uuid";
import Faker from "faker";
import {merge} from "shared/helpers/common";
import {Robot} from "shared/types";

export default function makeRobot(data={}) {
  return Robot(merge(data, {
    id: UUID.v4(),
    name: Faker.name.firstName(),
    manufacturer: Faker.random.arrayElement(["Russia", "USA", "China"]),
    assemblyDate: Faker.date.between("1970-01-01", "1995-01-01"),
  }));
}
