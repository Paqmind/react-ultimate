import {reduce} from "ramda";
import Joi from "joi";
import {unflattenObject} from "shared/helpers/common";

// EXPORTS =========================================================================================
let joiOptions = {
  abortEarly: false,
  allowUnknown: true,
};

function joiValidate(data, joiSchema) {
  let {value, error: joiError} = Joi.validate(data, joiSchema, joiOptions);
  return [value, joiFormatErrors(joiError)];
}

export default {
  joiOptions, joiValidate
}

// HELPERS =========================================================================================
function joiFormatErrors(joiError) {
  if (joiError) {
    let errorObject = reduce((memo, detail) => {
      if (!(memo[detail.path] instanceof Array)) {
        memo[detail.path] = [];
      }
      memo[detail.path].push(detail.message);
      return memo;
    }, {}, joiError.details);
    return unflattenObject(errorObject);
  } else {
    return {};
  }
}
