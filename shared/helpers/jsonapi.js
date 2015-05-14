// IMPORTS =========================================================================================
import {join, keys, map, pipe, split, reduce} from "ramda";

// JSON API ========================================================================================
export function parseQuery(query) {
  return {
    filters: query.filter,

    sorts: query.sort ?
      pipe(
        map(v => v.trim()),
        map(v => v.replace(/^(\w|\d)/, "+$1"))
      )(split(",", query.sort)) :
      undefined,

    page: {
      offset: query.page && (query.page.offset || query.page.offset == 0) ?
        query.page.offset :
        undefined,

      limit: query.page && (query.page.limit || query.page.limit == 0) ?
        query.page.limit :
        undefined,
    },

    reset: query.reset == "true" ?
      true :
      undefined,
  };
}

export function formatQuery(params) {
  if (!params instanceof Object) {
    throw new Error(`params must be a basic Object, got ${params}`);
  }

  let sortObj = {};
  let filterObj = {};
  let pageObj = {};

  if (params.filters) {
    filterObj = reduce((filterObj, key) => {
      filterObj[`filter[${key}]`] = params.filters[key];
      return filterObj;
    }, filterObj, keys(params.filters));
  }
  if (params.sorts) {
    sortObj["sort"] = join(",", params.sorts);
  }
  if (params.page) {
    if (params.page.offset || params.page.offset == 0) {
      pageObj["page[offset]"] = params.page.offset;
    }
    if (params.page.limit || params.page.limit == 0) {
      pageObj["page[limit]"] = params.page.limit;
    }
  }

  return Object.assign({}, sortObj, filterObj, pageObj);
}