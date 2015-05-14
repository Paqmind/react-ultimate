// IMPORTS =========================================================================================
import UUID from "node-uuid";
import {keys} from "ramda";
import {flattenArrayObject, mergeDeep} from "shared/helpers/common";
import {joiValidate} from "shared/helpers/validation";
import validators from "shared/validators/monster";

// MODELS ==========================================================================================
export default function Monster(data) {
  // Convert and validate
  let [value, errors] = joiValidate(data, validators.model);
  if (keys(errors).length) {
    throw Error(`invalid Monster data, errors: ${flattenArrayObject(errors).join(", ")}`);
  }

  // Merge with default values
  return mergeDeep({
    id: UUID.v4(),
  }, value);
}