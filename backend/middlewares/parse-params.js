import {map} from "ramda";
import {validate} from "tcomb-validation";
import {parseTyped} from "shared/parsers";

export default function createParseParams(type) {
  if (!type) { throw Error("`type` is required"); }
  return function parseParams(req, res, cb) {
    let data = parseTyped(req.params, type);
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
