let Path = require("path")
let {map} = require("ramda")
let {validate} = require("tcomb-validation")
let {PUBLIC_DIR} = require("common/constants")
let jsonApi = require("common/helpers/jsonapi")
let {parseTyped} = require("common/parsers")
let logger = require("backend/logger")

module.exports = function createParseQuery(type) {
  if (!type) { throw Error("`type` is required") }
  return function parseQuery(req, res, cb) {
    req.query = jsonApi.parseQuery(req.query)
    let data = parseTyped(type, req.query)
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
