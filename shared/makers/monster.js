import UUID from "node-uuid";
import Faker from "faker";
import {merge} from "shared/helpers/common";
import {Monster} from "shared/types/monster";

export default function makeMonster(data={}) {
  return Monster(merge(data, {
    id: UUID.v4(),
    name: Faker.name.findName(),
    citizenship: Faker.random.arrayElement(["Russia", "USA", "China"]),
    birthDate: Faker.date.between("1970-01-01", "1995-01-01"),
  }));
}
