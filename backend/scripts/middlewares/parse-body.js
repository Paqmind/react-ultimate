// IMPORTS =========================================================================================
import Joi from "joi";
import {joiOptions} from "shared/helpers/validation";
import {toSingleMessage} from "backend/scripts/helpers";

// MIDDLEWARES =====================================================================================
export default function createParseBody(scheme, options=joiOptions) {
  if (!scheme) { throw Error("`scheme` is required"); }
  return function parseBody(req, res, cb) {
    let result = Joi.validate(req.body, scheme, options);
    if (result.error) {
      return res.status(400).render("errors/400.html", {
        errors: toSingleMessage(result)
      });
    } else {
      req.body = result.value;
      return cb();
    }
  };
}
