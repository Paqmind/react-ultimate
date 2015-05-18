// IMPORTS =========================================================================================
import Moment from "moment";

// CONSTANTS =======================================================================================
const ISO_8601 = "YYYY-MM-DDTHH:mm:ss";

// PARSERS =========================================================================================
export function parseString(value) {
  if (value === "") {
    return undefined;
  } else {
    if (typeof value == "string") {
      value = value.trim();
      return value;
    } else {
      throw new Error(`value must be of string type, got ${typeof value}`);
    }
  }
}

export function parseInteger(value) {
  if (value === "") {
    return undefined;
  } else {
    if (typeof value == "string") {
      value = value.trim();
      if (/^-?\d+$/.test(value)) {
        return Number(value);
      } else {
        throw new Error(`invalid integer string: ${value}`);
      }
    } else {
      throw new Error(`value must be of string type, got ${typeof value}`);
    }
  }
}

export function parseFloat(value) {
  if (value === "") {
    return undefined;
  } else {
    if (typeof value == "string") {
      value = value.trim();
      if (/^-?\d+(\.\d+)*$/.test(value)) {
        return Number(value);
      } else {
        throw new Error(`invalid float string: ${value}`);
      }
    } else {
      throw new Error(`value must be of string type, got ${typeof value}`);
    }
  }
}

export function parseDate(value, format=ISO_8601) {
  if (!format || (!(typeof format == "string"))) {
    throw new Error(`format must be non-empty string, got ${format}`);
  }
  if (value === "") {
    return undefined;
  } else {
    if (typeof value == "string") {
      value = value.trim();
      let _value = Moment(value, format, true); // `true` to enforce format (strict parsing)
      if (_value.isValid()) {
        return _value;
      } else {
        throw new Error(`invalid date string: ${value}`);
      }
    } else {
      throw new Error(`value must be of string type, got ${typeof value}`);
    }
  }
}

// FORMATTERS ======================================================================================
export function formatString(value) {
  if (value === undefined) {
    return "";
  } else {
    if (typeof value == "string") {
      return value;
    } else {
      throw new Error(`value must be of string type, got ${typeof value}`);
    }
  }
}

export function formatInteger(value) {
  if (value === undefined) {
    return "";
  } else {
    if (typeof value == "string") {
      return value;
    }
    else if (typeof value == "number") {
      if (Math.round(value) == value) {
        return String(value);
      } else {
        throw new Error(`invalid integer value: ${value}`);
      }
    } else {
      throw new Error(`value must be of integer type, got ${typeof value}`);
    }
  }
}

export function formatFloat(value) {
  if (value === undefined) {
    return "";
  } else {
    if (typeof value == "string") {
      return value;
    }
    else if (typeof value == "number") {
      return String(value);
    } else {
      throw new Error(`value must be of float type, got ${typeof value}`);
    }
  }
}

export function formatDate(value, format=ISO_8601) {
  if (!format || (!(typeof format == "string"))) {
    throw new Error(`format must be non-empty string, got ${format}`);
  }
  if (value === undefined) {
    return "";
  } else {
    if (typeof value == "string") {
      return value;
    }
    //else if (value instanceof Date) {
    //  // TODO solve timezone difference between Moment and Date objects
    //  let moment = Moment(value);
    //  if (moment.isValid()) {
    //    return moment.format(format);
    //  } else {
    //    throw new Error(`invalid date value: ${value}`);
    //  }
    //}
    else if (Moment.isMoment(value)) {
      return value.format(format);
    }
    else {
      throw new Error(`value must be of Moment type, got ${typeof value}`);
    }
  }
}