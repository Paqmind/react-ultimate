// IMPORTS =========================================================================================
import UUID from "node-uuid";
import {filter, flatten, keys, values} from "ramda";
import Moment from "moment";
import {flattenObject, mergeDeep} from "shared/helpers/common";
import {joiValidate} from "shared/helpers/validation";
import validators from "shared/validators/alert";

// MODELS ==========================================================================================
export default function Alert(data) {
  // Convert and validate
  let [model, errors] = joiValidate(data, validators.model);
  if (Object.keys(errors).length) {
    let errorObj = flattenObject(errors);
    let errorArr = filter(v => v, flatten(values(errors)));
    throw Error(`invalid Alert data, errors: ${errorArr.join(", ")}`);
  }

  return mergeDeep({
    id: UUID.v4(),
    closable: true,
    expire: data.category == "error" ? 0 : 5000,
    createdDate: data.createdDate ? data.createdDate : new Date()
  }, data);
}
