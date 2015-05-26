// IMPORTS =========================================================================================
import {assoc, keys, map, pipe, reduce} from "ramda";

// JSON API ========================================================================================
export function parseQuery(query) {
  let result = {};

  if (query.filter) {
    result.filters = query.filter;
  }
  if (query.sort) {
    result.sorts = map(v => v.replace(/^ /, "+"), query.sort.split(","));
  }
  if (query.page) {
    if (query.page.offset || query.page.offset == 0) {
      result.offset = query.page.offset;
    }
    if (query.page.limit || query.page.limit == 0) {
      result.limit = query.page.limit;
    }
  }
  if (query.reset) {
    result.reset = true;
  }

  return result;
}

export function formatQuery(query) {
  if (!query instanceof Object) {
    throw new Error(`query must be a basic Object, got ${query}`);
  }

  let result = {};

  if (query.filters) {
    result.filter = query.filters;
  }
  if (query.sorts) {
    result.sort = query.sorts.join(",");
  }
  if (query.offset || query.offset == 0) {
    result.page = result.page || {};
    result.page.offset = query.offset;
  }
  if (query.limit || query.limit == 0) {
    result.page = result.page || {};
    result.page.limit = query.limit;
  }
  if (query.reset) {
    result.reset = true;
  }

  return result;
}

export function formatQueryForAxios(query) {
  if (!query instanceof Object) {
    throw new Error(`query must be a basic Object, got ${query}`);
  }

  let result = {};

  if (query.filters) {
    result = reduce((memo, key) => {
      let value = query.filters[key];
      return assoc(`filter[${key}]`, value, memo);
    }, result, Object.keys(query.filters));
  }
  if (query.sorts) {
    result.sort = query.sorts.join(",");
  }
  if (query.offset || query.offset == 0) {
    result["page[offset]"] = query.offset;
  }
  if (query.limit || query.limit == 0) {
    result["page[limit]"] = query.limit;
  }
  if (query.reset) {
    result.reset = true;
  }

  return result;
}
