// IMPORTS =========================================================================================
import Faker from "faker";
import {mergeDeep} from "shared/helpers/common";
import Alert from "shared/models/Alert";

// EXPORTS =========================================================================================
export default function makeAlert(manualData={}) {
  return Alert(mergeDeep({
    closable: Faker.random.array_element([false, true]),
    expire: Faker.number.between(0, 5000),
  }, manualData));
}
