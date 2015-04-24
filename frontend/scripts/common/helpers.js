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

export function parseJsonApiQuery(query) {
  return {
    filters: query.filter,
    sorts: (query.sort ? query.sort.split(",").map(v => v.replace(/^ /, "+")) : undefined)
  };
}

export function formatJsonApiQuery(page, perpage, filters, sorts) {
  let pageObj, filterObj, sortObj;
  if (page && perpage) {
    pageObj = {
      "page[offset]": (page > 1 ? page - 1 : 0) * perpage,
      "page[limit]": perpage,
    };
  }
  if (filters) {
    filterObj = Object.keys(filters).reduce((filterObj, key) => {
      filterObj[`filter[${key}]`] = filters[key];
      return filterObj;
    }, {});
  }
  if (sorts) {
    sortObj = {
      "sort": sorts.join(","),
    };
  }
  return Object.assign({}, pageObj, filterObj, sortObj);
}