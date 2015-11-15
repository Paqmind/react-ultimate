import Path from "path";
import {map} from "ramda";
import {validate} from "tcomb-validation";
import {PUBLIC_DIR} from "shared/constants";
import {parseTyped} from "shared/parsers";
import logger from "backend/logger";

export default function createParseBody(type) {
  if (!type) { throw Error("`type` is required"); }
  return function parseBody(req, res, cb) {
    let data = parseTyped(type, req.body);
    let result = validate(data, type);
    if (result.isValid()) {
      return cb();
    } else {
      if (process.env.NODE_ENV != "testing") {
        logger.error(result.errors);
      }
      return res.status(400).sendFile(Path.join(PUBLIC_DIR, "errors/400.html"));
    }
  };
}
