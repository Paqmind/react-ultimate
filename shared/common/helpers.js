// IMPORTS =========================================================================================
import range from "lodash.range";
import merge from "lodash.merge";
import sortBy from "lodash.sortby";

// HELPERS =========================================================================================
/**
 * Split array into chunks with predefined chunk length. Useful for pagination.
 * Example:
 *   chunked([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]]
 * @pure
 * @param array {Array} - array to be chunked
 * @param n {number} - length of chunk
 * @returns {Array} - chunked array
 */
export function chunked(array, n) {
  let l = Math.ceil(array.length / n);
  return range(l).map((x, i) => array.slice(i*n, i*n + n));
}

/**
 * Converts sorting array in "short" format to sorting array in "lodash" (lodash.sortByOrder) format.
 * Example:
 *   lodashifySorts(["+name", "-age"]) == [["name", "age"], [true, false]]
 * @pure
 * @param sorts {Array<string>} - array in "short" format
 * @returns {Array<Array<string>>} - array in "lodash" format
 */
export function lodashifySorts(sorts) {
  return [
    sorts.map(v => v.slice(1)),
    sorts.map(v => v[0] == "+"),
  ];
}

export function mergeDeep(object, other) {
  return merge({}, object, other, (a, b) => {
    if (a instanceof Array) {
      return a.concat(b);
    }
  });
}

export function flattenArrayGroup(object, sorter=(v => v)) {
  return sortBy(Object.keys(object), sorter).reduce((combinedArray, key) => {
    return combinedArray.concat(object[key]);
  }, [])
}

export function findFirstLesserOffset(pagination, offset) {
  let offsets = Object.keys(pagination).map(v => parseInt(v)).sort().reverse();
  for (let o of offsets) {
    if (parseInt(o) < offset) {
      return o;
    }
  }
  return 0;
}

export function toObject(array) {
  if (array instanceof Array) {
    return array.reduce((object, item) => {
      object[item.id] = item;
      return object;
    }, {});
  } else {
    throw Error(`array must be plain Array, got ${array}`);
  }
}

export function toArray(object) {
  if (object instanceof Object) {
    return sortBy(
      Object.keys(object).map(key => object[key]),
      item => item.id
    );
  } else {
    throw Error(`object must be a basic Object, got ${object}`);
  }
}

export function parseJsonApiQuery(query) {
  return {
    filters: query.filter,
    sorts: query.sort ? query.sort.split(",").map(v => v.trim()).map(v => v.replace(/^(\w|\d)/, "+$1")) : undefined,
    offset: query.page && (query.page.offset || query.page.offset == 0) ? query.page.offset : undefined,
    limit: query.page && (query.page.limit || query.page.offset == 0) ? query.page.limit : undefined,
    reset: query.reset == "true" ? true : undefined,
  };
}

export function formatJsonApiQuery(modifiers) {
  if (!modifiers instanceof Object) {
    throw new Error(`modifiers must be a basic Object, got ${modifiers}`);
  }

  let sortObj = {};
  let filterObj = {};
  let pageObj = {};

  if (modifiers.filters) {
    filterObj = Object.keys(modifiers.filters).reduce((filterObj, key) => {
      filterObj[`filter[${key}]`] = modifiers.filters[key];
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

export function normalize(data) {
  if (data instanceof Array) {
    return data.map(v => normalize(v));
  } else if (data instanceof Object) {
    return Object.keys(data).reduce((obj, k) => {
      if (k.includes(".")) {
        let kk = k.split(".");
        obj[kk[0]] = normalize({[kk.slice(1).join(".")]: data[k]});
      } else {
        obj[k] = normalize(data[k]);
      }
      return obj;
    }, {});
  } else if (typeof data == "string") {
    if (data === "false") {
      return false;
    } else if (data === "true") {
      return true;
    } else if (data === "undefined") {
      return undefined;
    } else if (data === "null") {
      return null;
    } else if (data.match(/^-?\d+\.\d+/)) {
      return parseFloat(data);
    } else if (data.match(/^-?\d+/)) {
      return parseInt(data);
    } else {
      return data;
    }
  } else {
    return data;
  }
}