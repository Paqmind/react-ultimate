// IMPORTS =========================================================================================
import UUID from "node-uuid";
import {keys} from "ramda";
import Moment from "moment";
import {flattenArrayObject, mergeDeep} from "shared/helpers/common";
import {joiValidate} from "shared/helpers/validation";
import validators from "shared/validators/monster";

// MODELS ==========================================================================================
export default function Monster(data) {
  // Convert and validate
  let [model, errors] = joiValidate(data, validators.model);
  if (Object.keys(errors).length) {
    let errorObj = flattenObject(errors);
    let errorArr = filter(v => v, flatten(values(errors)));
    throw Error(`invalid Monster data, errors: ${errorArr.join(", ")}`);
  }

  model.birthDate = Moment(model.birthDate);

  // Merge with default values
  return mergeDeep({
    id: UUID.v4(),
  }, model);
}