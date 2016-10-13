let Path = require("path")
let {map} = require("ramda")
let {validate} = require("tcomb-validation")
let {PUBLIC_DIR} = require("common/constants")
let {parseTyped} = require("common/parsers")
let logger = require("backend/logger")

module.exports = function createParseParams(type) {
  if (!type) { throw Error("`type` is required") }
  return function parseParams(req, res, cb) {
    let data = parseTyped(type, req.params)
    let result = validate(data, type)
    if (result.isValid()) {
      return cb()
    } else {
      if (process.env.NODE_ENV != "testing") {
        logger.error(result.errors)
      }
      return res.status(400).sendFile(Path.join(PUBLIC_DIR, "errors/400.html"))
    }
  }
}
