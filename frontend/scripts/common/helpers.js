// IMPORTS =========================================================================================
import sortBy from "lodash.sortby";
import isArray from "lodash.isarray";
import isPlainObject from "lodash.isplainobject";

// HELPERS =========================================================================================
export function toObject(array) {
  if (isArray(array)) {
    return array.reduce((object, item) => {
      object[item.id] = item;
      return object;
    }, {});
  } else {
    throw Error(`array must be plain Array, got ${array}`);
  }
}

export function toArray(object) {
  if (isPlainObject(object)) {
    return sortBy(
      Object.keys(object).map(key => object[key]),
      item => item.id
    );
  } else {
    throw Error(`object must be plain Object, got ${object}`);
  }
}

export function parseJsonApiQuery(query) {
  return {
    filters: query.filter,
    sorts: query.sort ? query.sort.split(",").map(v => v.replace(/^ /, "+")) : undefined,
    offset: query.page && (query.page.offset || query.page.offset == 0) ? parseInt(query.page.offset) : undefined,
    limit: query.page && (query.page.limit || query.page.offset == 0) ? parseInt(query.page.limit) : undefined,
  };
}

export function formatJsonApiQuery(modifiers) {
  if (!isPlainObject(modifiers)) {
    throw new Error(`modifiers must be plain Object, got ${modifiers}`);
  }

  let sortObj = {};
  let filterObj = {};
  let pageObj = {};

  if (modifiers.filters) {
    filterObj = Object.keys(modifiers.filters).reduce((filterObj, key) => {
      filterObj[`filter[${key}]`] = filters[key];
      return filterObj;
    }, filterObj);
  }
  if (modifiers.sorts) {
    sortObj["sort"] = modifiers.sorts.join(",");
  }
  if (modifiers.offset || modifiers.offset == 0) {
    pageObj["page[offset]"] = modifiers.offset;
  }
  if (modifiers.limit || modifiers.limit == 0) {
    pageObj["page[limit]"] = modifiers.limit;
  }

  return Object.assign({}, sortObj, filterObj, pageObj);
}