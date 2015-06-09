// IMPORTS =========================================================================================
import Joi from "joi";
import {joiOptions} from "shared/helpers/validation";
import {toSingleMessage} from "backend/helpers";

// MIDDLEWARES =====================================================================================
export default function createParseParams(scheme, options=joiOptions) {
  if (!scheme) { throw Error("`scheme` is required"); }
  return function parseParams(req, res, cb) {
    let result = Joi.validate(req.params, scheme, options);
    if (result.error) {
      return res.status(400).render("errors/400.html", {
        errors: toSingleMessage(result)
      });
    } else {
      req.params = result.value;
      return cb();
    }
  };
}
