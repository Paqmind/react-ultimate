import UUID from "node-uuid";
import Faker from "faker";
import {merge} from "shared/helpers/common";
import {Alert} from "shared/types";

export default function makeAlert(data={}) {
  return Alert(merge({
    id: UUID.v4(),
    closable: Faker.random.arrayElement([false, true]),
    expire: Faker.number.between(0, 5000),
  }, data));
}
