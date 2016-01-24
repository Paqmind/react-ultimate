import {filter, find, forEach, identity, keys, map, pipe, propEq, slice, sortBy, tap, values} from "ramda";
import Baobab from "baobab";
import throttle from "lodash.throttle";
import {filterByAll, sortByAll} from "shared/helpers/common";
import {parseQuery} from "shared/helpers/jsonapi";
import {ALERT, ROBOT, MONSTER} from "shared/constants";
import robotApi from "shared/api/robot";
import monsterApi from "shared/api/robot";

let monkey = Baobab.monkey;

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

    DB: {
      robots: {},
      monsters: {},
    },

    UI: {
      robots: {
        total: 0,
        pagination: [],

        // INDEX
        filters: ROBOT.index.filters,
        sorts: ROBOT.index.sorts,
        offset: ROBOT.index.offset,
        limit: ROBOT.index.limit,
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
          ["UI", "robots", "total"],
          ["UI", "robots", "pagination"],
          function (total, pagination) {
            let loaded = filter(id => id, pagination).length;
            if (loaded < total) {
              return false;
            } else if (loaded == total) {
              return true;
            } else {
              throw Error(`invalid total ${total}`);
            }
          }
        ]),

        currentItem: monkey([
          ["DB", "robots"],
          ["UI", "robots", "id"],
          function (items, id) {
            if (id) {
              return items[id];
            } else {
              return undefined;
            }
          }
        ]),

        currentItems: monkey([
          ["DB", "robots"],
          ["UI", "robots", "filters"],
          ["UI", "robots", "sorts"],
          ["UI", "robots", "offset"],
          ["UI", "robots", "limit"],
          ["UI", "robots", "pagination"],
          ["UI", "robots", "fullLoad"],
          function (items, filters, sorts, offset, limit, pagination, fullLoad) {
            let itemsArray = map(id => id && items[id], pagination);
            return pipe(
              fullLoad ? filterByAll(filters) : identity,
              fullLoad ? sortByAll(sorts) : identity,
              slice(offset, offset + limit),
              filter(m => m)
            )(itemsArray);
          }
        ]),
      },
      monsters: {
        total: 0,
        pagination: [],

        // INDEX
        filters: MONSTER.index.filters,
        sorts: MONSTER.index.sorts,
        offset: MONSTER.index.offset,
        limit: MONSTER.index.limit,
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
          ["UI", "monsters", "total"],
          ["UI", "monsters", "pagination"],
          function (total, pagination) {
            let loaded = filter(id => id, pagination).length;
            if (loaded < total) {
              return false;
            } else if (loaded == total) {
              return true;
            } else {
              throw Error(`invalid total ${total}`);
            }
          }
        ]),

        currentItem: monkey([
          ["DB", "monsters"],
          ["UI", "monsters", "id"],
          function (items, id) {
            if (id) {
              return items[id];
            } else {
              return undefined;
            }
          }
        ]),

        currentItems: monkey([
          ["DB", "monsters"],
          ["UI", "monsters", "filters"],
          ["UI", "monsters", "sorts"],
          ["UI", "monsters", "offset"],
          ["UI", "monsters", "limit"],
          ["UI", "monsters", "pagination"],
          ["UI", "monsters", "fullLoad"],
          function (items, filters, sorts, offset, limit, pagination, fullLoad) {
            let itemsArray = map(id => id && items[id], pagination);
            return pipe(
              fullLoad ? filterByAll(filters) : identity,
              fullLoad ? sortByAll(sorts) : identity,
              slice(offset, offset + limit),
              filter(m => m)
            )(itemsArray);
          }
        ]),
      },
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
