import {filter, find, forEach, identity, keys, map, pipe, propEq, slice, sortBy, tap, values} from "ramda";
import Baobab from "baobab";
import throttle from "lodash.throttle";
import {filterByAll, sortByAll} from "shared/helpers/common";
import {parseQuery} from "shared/helpers/jsonapi";
import {ALERT, ROBOT, MONSTER} from "shared/constants";
import robotApi from "shared/api/robot";
import monsterApi from "shared/api/robot";

let monkey = Baobab.monkey;


function fullLoad(ids) {
  let loaded = filter(id => id, ids).length;
  return loaded == ids.length;
}

function currentItem(items, id) {
  if (id) {
    return items[id];
  } else {
    return undefined;
  }
}

function currentItems(filters, sorts, offset, limit, items, ids, fullLoad) {
  let itemsArray = map(id => id && items[id], ids);
  return pipe(
    fullLoad ? filterByAll(filters) : identity,
    fullLoad ? sortByAll(sorts) : identity,
    slice(offset, offset + limit),
    filter(m => m)
  )(itemsArray);
}

window._state = new Baobab(
  {
    url: {
      route: undefined,
      path: undefined,
      params: {},
      query: {},
    },

    ajaxQueue: [],

    alertQueue: [],
    alertTimeout: undefined,

    robots: {
      // DATA
      items: {},
      ids: [],

      // INDEX
      filters: ROBOT.index.defaultFilters,
      sorts: ROBOT.index.defaultSorts,
      offset: 0,
      limit: ROBOT.index.defaultLimit,
      // filterForm ???
      // filterFormErrors ???

      // CRUD
      id: undefined,
      addForm: {},
      addFormErrors: {},
      editForm: {},
      editFormErrors: {},

      // FACETS
      havePendingRequests: monkey([
        ["ajaxQueue"],
        function (queue) {
          return ajaxQueueContains(queue, robotApi.indexUrl);
        }
      ]),

      fullLoad: monkey([
        ["robots", "ids"],
        fullLoad,
      ]),

      currentItem: monkey([
        ["robots", "items"],
        ["robots", "id"],
        currentItem,
      ]),

      currentItems: monkey([
        ["robots", "filters"],
        ["robots", "sorts"],
        ["robots", "offset"],
        ["robots", "limit"],
        ["robots", "items"],
        ["robots", "ids"],
        ["robots", "fullLoad"],
        currentItems,
      ]),
    },

    monsters: {
      // DATA
      items: {},
      ids: [],

      // INDEX
      filters: MONSTER.index.defaultFilters,
      sorts: MONSTER.index.defaultSorts,
      offset: 0,
      limit: MONSTER.index.defaultLimit,
      // filterForm ???
      // filterFormErrors ???

      // CRUD
      id: undefined,
      addForm: {},
      editForm: {},
      addFormErrors: {},
      editFormErrors: {},

      // FACETS
      havePendingRequests: monkey([
        ["ajaxQueue"],
        function (queue) {
          return ajaxQueueContains(queue, monsterApi.indexUrl);
        }
      ]),

      fullLoad: monkey([
        ["monsters", "ids"],
        fullLoad,
      ]),

      currentItem: monkey([
        ["monsters", "items"],
        ["monsters", "id"],
        currentItem,
      ]),

      currentItems: monkey([
        ["monsters", "filters"],
        ["monsters", "sorts"],
        ["monsters", "offset"],
        ["monsters", "limit"],
        ["monsters", "items"],
        ["monsters", "ids"],
        ["monsters", "fullLoad"],
        currentItems,
      ]),
    },

    urlQuery: monkey([
      ["url", "query"],
      function (query) {
        let {filters, sorts, offset, limit} = parseQuery(query);
        return {filters, sorts, offset, limit};
      }
    ]),
  },
  { // OPTIONS
    immutable: process.env.NODE_ENV != "production",
  }
);

function ajaxQueueContains(queue, url) {
  return Boolean(filter(pendindRequest => pendindRequest.url.startsWith(url), queue).length);
}

export default window._state;
