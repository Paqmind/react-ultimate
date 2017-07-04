let {assoc, filter, join, reduce} = require("ramda")
let debounce = require("lodash.debounce")
let {validate} = require("tcomb-validation")
let {unflattenObject} = require("common/helpers/common")
let {parseTyped} = require("./parsers")

// TcombErrors -> String -> Object
function unflattenErrors(errors, key) {
  let flatErrors = reduce((memo, error) => {
    let path = join(".", error.path)
    let flatKey = join(".", filter(x => x, [key, path]))
    return assoc(flatKey, error.message.replace(/ supplied to.*$/, ""), memo)
  }, {}, errors)
  return unflattenObject(flatErrors)
}

// Any -> Type -> String -> {valid, errors}
function validateValue(value, type, key) {
  let result = validate(value, type)
  let valid = result.isValid()
  let errors = valid ? null : unflattenErrors(result.errors, key)
  return {valid, errors}
}

// Any -> Type -> String -> {valid, errors, value}
function validateData(data, type, key) {
  let value = parseTyped(type, data)
  let {valid, errors} = validateValue(value, type, key)
  return {valid, errors, value}
}

exports.validateValue = validateValue // validate business value
exports.validateData = validateData //exports        // validate raw data (form / file) -- fixes `not a fn` issue
