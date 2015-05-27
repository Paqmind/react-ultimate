// IMPORTS =========================================================================================
import Joi from "joi";
import * as jsonApi from "shared/helpers/jsonapi";
import {joiOptions} from "shared/helpers/validation";
import {toSingleMessage} from "backend/scripts/helpers";

// MIDDLEWARES =====================================================================================
export default function createParseQuery(scheme, options=joiOptions) {
  if (!scheme) { throw Error("`scheme` is required"); }
  return function parseQuery(req, res, cb) {
    let parsedQuery = jsonApi.parseQuery(req.query);
    let result = Joi.validate(parsedQuery, scheme, options);
    if (result.error) {
      return res.status(400).render("errors/400.html", {
        errors: toSingleMessage(result)
      });
    } else {
      req.query = result.value;
      return cb();
    }
  };
}
