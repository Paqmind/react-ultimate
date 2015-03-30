// IMPORTS =========================================================================================
let sortBy = require("lodash.sortby");
let isArray = require("lodash.isarray");
let isPlainObject = require("lodash.isplainobject");

// HELPERS =========================================================================================
export function toObject(array) {
  if (isArray(array)) {
    return array.reduce((object, item) => {
      object[item.id] = item;
      return object;
    }, {});
  } else {
    throw Error("expected type is Array, get " + typeof array);
  }
}

export function toArray(object) {
  if (isPlainObject(object)) {
    return sortBy(
      Object.keys(object).map(key => object[key]),
      item => item.id
    );
  } else {
    throw Error("expected type is Object, get " + typeof object);
  }
}

