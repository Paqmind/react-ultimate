// IMPORTS =========================================================================================
import {merge} from "ramda";
import Faker from "faker";
import Alert from "shared/models/Alert";

// EXPORTS =========================================================================================
export default function makeAlert(manualData) {
  return Alert(merge({
    closable: Faker.random.array_element([false, true]),
    expire: Faker.number.between(0, 5000),
  }, manualData));
}
