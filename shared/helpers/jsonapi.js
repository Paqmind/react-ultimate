// JSON API ========================================================================================
export function parseQuery(query) {
  return {
    filters: query.filter,
    sorts: query.sort ? query.sort.split(",").map(v => v.trim()).map(v => v.replace(/^(\w|\d)/, "+$1")) : undefined,
    offset: query.page && (query.page.offset || query.page.offset == 0) ? query.page.offset : undefined,
    limit: query.page && (query.page.limit || query.page.offset == 0) ? query.page.limit : undefined,
    reset: query.reset == "true" ? true : undefined,
  };
}

export function formatQuery(modifiers) {
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