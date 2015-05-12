// IMPORTS =========================================================================================
import {reduce} from "ramda";
import Joi from "joi";

// EXPORTS =========================================================================================
export const joiOptions = {
  abortEarly: false,
  allowUnknown: true,
};

export function joiValidate(data, joiSchema) {
  let {value, error: joiError} = Joi.validate(data, joiSchema, joiOptions);
  return [value, formatErrors(joiError)];
}

// HELPERS =========================================================================================
function formatErrors(joiError) {
  if (joiError) {
    return reduce((memo, detail) => {
      if (!(memo[detail.path] instanceof Array)) {
        memo[detail.path] = [];
      }
      memo[detail.path].push(detail.message);
      return memo;
    }, {}, joiError.details);
  } else {
    return {};
  }
}