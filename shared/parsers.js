import {identity, keys, map, reduce, reduceIndexed} from "ramda";
import Tc from "tcomb";
import Globalize from "globalize";
import {isArray, isPlainObject} from "shared/helpers/common";

function parseBoolean(value) {
  value = value.trim();
  if (value == "") {
    return undefined;
  } else if (value == "true" || value == "yes" || value == "1") {
    return true;
  } else if (value == "false" || value == "no" || value == "0") {
    return false;
  } else {
    return value;
  }
}

function parseDate(value, options) {
  value = value.trim();
  if (value == "") {
    return undefined;
  } else {
    //try {
    //  return Moment(value).toDate();
    //} catch (err) {
    //  return Globalize.parseDate(value, options);
    //}
    let date = new Date(value);
    if (date.toString(date) == "Invalid Date") {
      let parsedDate = Globalize.parseDate(value, options);
      return parsedDate ? parsedDate : value;
    } else {
      return date;
    }
  }
}

function parseInteger(value) {
  value = value.trim();
  if (value == "") {
    return undefined;
  } else {
    if (/^-?\d+$/.test(value)) {
      return Number(value);
    } else {
      return value;
    }
  }
}

function parseFloat(value) {
  value = value.trim();
  if (value == "") {
    return undefined;
  } else {
    if (/^-?\d+(\.\d+)*$/.test(value)) {
      return Number(value);
    } else {
      return value;
    }
  }
}

function parseString(value) {
  value = value.trim();
  if (value == "") {
    return undefined;
  } else {
    return value;
  }
}

function parseTyped(data, type) {
  if (isArray(data)) {
    return map(v => parseTyped(v, type ? type.meta.type : undefined), data);
  } else if (isPlainObject(data)) {
    return reduce((obj, k) => {
      if (k.includes(".")) {
        // compound key
        let kk = k.split(".");
        obj[kk[0]] = parseTyped({[kk.slice(1).join(".")]: data[k]}, type);
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
        //}
        obj[k] = parseTyped(data[k], nextType);
      }
      return obj;
    }, {}, keys(data));
  } else if (typeof data == "string") {
    let parser = type ? typeToParser.get(type) : identity;
    if (parser) {
      return parser(data);
    } else {
      return parseString(data);
    }
  } else {
    return data;
  }
}

function parseAs(data, type) {
  return type(parseTyped(data, type));
}

function parseDefault(data) {
  if (data instanceof Array) {
    return map(v => parseDefault(v), data);
  } else if (data instanceof Object) {
    return reduce((obj, k) => {
      if (k.includes(".")) {
        let kk = k.split(".");
        obj[kk[0]] = parseDefault({[kk.slice(1).join(".")]: data[k]});
      } else {
        obj[k] = parseDefault(data[k]);
      }
      return obj;
    }, {}, keys(data));
  } else if (typeof data == "string") {
    if (data === "false") {
      return false;
    } else if (data === "true") {
      return true;
    } else if (data === "undefined") {
      return undefined;
    } else if (data === "null") {
      return null;
    } else if (data.match(/^-?\d+\.\d+$/)) {
      return parseFloat(data);
    } else if (data.match(/^-?\d+$/)) {
      return parseInt(data);
    } else {
      return data;
    }
  } else {
    return data;
  }
}

let typeToParser = new Map([
  [Tc.Boolean, parseBoolean],
  [Tc.Date, parseDate],
  [Tc.Number, parseFloat],
]);

export default {
  parseBoolean,
  parseDate,
  parseInteger,
  parseFloat,
  parseString,

  // Important general-purpose functions
  parseTyped,
  parseAs,
  parseDefault,
};
