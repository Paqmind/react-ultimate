let {curry, identity, keys, map, reduce} = require("ramda")
let Tc = require("tcomb")
let {isArray, isPlainObject} = require("common/helpers/common")

function formatBoolean(value) {
  if (value === undefined || value === null) {
    return ""
  } else {
    return `${value}`
  }
}

function formatString(value) {
  if (value === undefined || value === null) {
    return ""
  } else {
    return `${value}`
  }
}

function formatInteger(value) {
  if (value === undefined || value === null) {
    return ""
  } else {
    return `${value}`
  }
}

function formatFloat(value) {
  if (value === undefined || value === null) {
    return ""
  } else {
    return `${value}`
  }
}

function formatDate(value) {
  if (value === undefined || value === null) {
    return ""
  } else {
    return value // TODO: add formating, here was globalize
  }
}

let formatTyped = curry((type, value) => {
  if (isArray(value)) {
    return map(v => formatTyped(type ? type.meta.type : null, v), value)
  } else if (isPlainObject(value)) {
    return reduce((obj, k) => {
      if (k.includes(".")) {
        // compound key
        let kk = k.split(".")
        obj[kk[0]] = formatTyped(type, {[kk.slice(1).join(".")]: value[k]})
      } else {
        // simple key
        let nextType
        if (type && type.meta && type.meta.kind == "dict") {
          nextType = type.meta.codomain
        } else if (type && type.meta && type.meta.kind == "struct") {
          nextType = type.meta.props[k]
        } // else {
          // TODO do nothing?!
          //console.log(type)
          //throw Error(`Invalid type ${type} for key "${k}"`)
        // }
        obj[k] = formatTyped(nextType, value[k])
      }
      return obj
    }, {}, keys(value))
  } else {
    let formatter = type ? typeToFormatter.get(type) : identity
    return formatter ? formatter(value) : formatString(value)
  }
})

let typeToFormatter = new Map([
  [Tc.Boolean, formatBoolean],
  [Tc.Date, formatDate],
  [Tc.Number, formatFloat],
  // [SomeJsonType, JSON.stringify], // example
])

module.exports = {
  formatBoolean,
  formatDate,
  formatInteger,
  formatFloat,
  formatString,

  // Important general-purpose functions
  formatTyped,
  //formatDefault, TODO need?!
}
