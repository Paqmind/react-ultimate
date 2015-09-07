import Faker from "faker";
import {merge} from "shared/helpers/common";
import Alert from "shared/models/alert";

// EXPORTS =========================================================================================
export default function makeAlert(manualData={}) {
  return Alert(merge(manualData, {
    closable: Faker.random.arrayElement([false, true]),
    expire: Faker.number.between(0, 5000),
  }));
}
