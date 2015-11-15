import {identity, keys, map, reduce} from "ramda";
import Tc from "tcomb";
import Globalize from "globalize";
import {isArray, isPlainObject} from "shared/helpers/common";

function formatBoolean(value) {
  if (value === undefined) {
    return "";
  } else {
    return `${value}`;
  }
}

function formatString(value) {
  if (value === undefined) {
    return "";
  } else {
    return `${value}`;
  }
}

function formatInteger(value) {
  if (value === undefined) {
    return "";
  } else {
    return `${value}`;
  }
}

function formatFloat(value) {
  if (value === undefined) {
    return "";
  } else {
    return `${value}`;
  }
}

function formatDate(value) {
  if (value === undefined) {
    return "";
  } else {
    return Globalize.formatDate(value);
  }
}

function formatTyped(value, type) {
  if (isArray(value)) {
    return map(v => formatTyped(v, type ? type.meta.type : undefined), value);
  } else if (isPlainObject(value)) {
    return reduce((obj, k) => {
      if (k.includes(".")) {
        // compound key
        let kk = k.split(".");
        obj[kk[0]] = formatTyped({[kk.slice(1).join(".")]: value[k]}, type);
      } else {
        // simple key
        let nextType;
        if (type && type.meta && type.meta.kind == "dict") {
          nextType = type.meta.codomain;
        } else if (type && type.meta && type.meta.kind == "struct") {
          nextType = type.meta.props[k];
        } // else {
          // TODO do nothing?!
          //console.log(type);
          //throw Error(`Invalid type ${type} for key "${k}"`);
        // }
        obj[k] = formatTyped(value[k], nextType);
      }
      return obj;
    }, {}, keys(value));
  } else {
    let formatter = type ? typeToFormatter.get(type) : identity;
    return formatter ? formatter(value) : formatString(value);
  }
}

let typeToFormatter = new Map([
  [Tc.Boolean, formatBoolean],
  [Tc.Date, formatDate],
  [Tc.Number, formatFloat],
]);

export default {
  formatBoolean,
  formatDate,
  formatInteger,
  formatFloat,
  formatString,

  // Important general-purpose functions
  formatTyped,
  //formatDefault, TODO need?!
};
