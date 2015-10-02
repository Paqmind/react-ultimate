import {map} from "ramda";
import {validate} from "tcomb-validation";
import {PUBLIC_DIR} from "shared/constants";
import {parseTyped} from "shared/parsers";

export default function createParseBody(type) {
  if (!type) { throw Error("`type` is required"); }
  return function parseBody(req, res, cb) {
    let data = parseTyped(req.body, type);
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
