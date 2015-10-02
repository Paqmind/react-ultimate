import {map} from "ramda";
import {validate} from "tcomb-validation";
import {PUBLIC_DIR} from "shared/constants";
import jsonApi from "shared/helpers/jsonapi";
import {parseTyped} from "shared/parsers";

export default function createParseQuery(type) {
  if (!type) { throw Error("`type` is required"); }
  return function parseQuery(req, res, cb) {
    req.query = jsonApi.parseQuery(req.query);
    let data = parseTyped(req.query, type);
    let result = validate(data, type);
    if (result.isValid()) {
      return cb();
    } else {
      return res.status(400).render("errors/400.html", {
        errors: map(e => e.message, result.errors)
      });
    }
  };
}
