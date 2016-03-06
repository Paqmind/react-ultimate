import {filter, find, forEach, identity, keys, map, pipe, propEq, slice, sortBy, tap, values} from "ramda";
import Baobab from "baobab";
import throttle from "lodash.throttle";
import {filterByAll, sortByAll} from "shared/helpers/common";
import {parseQuery} from "shared/helpers/jsonapi";
import {ALERT, ROBOT, MONSTER} from "shared/constants";
import robotApi from "shared/api/robot";
import monsterApi from "shared/api/robot";

let monkey = Baobab.monkey;

let getCurrentItems = function(DBCursor, UICursor) {
  let {filters, sorts, offset, limit, ids, fullLoad} = UICursor;
  let itemsArray = map(id => id && DBCursor[id], ids);
  return pipe(
    fullLoad ? filterByAll(filters) : identity,
    fullLoad ? sortByAll(sorts) : identity,
    slice(offset, offset + limit),
    filter(m => m)
  )(itemsArray);
};
let getCurrentItem = function(DBCursor, UICursor) {
  return DBCursor[UICursor.id];
};
let getFullLoad = function(total, ids) {
  let loaded = filter(id => id, ids).length;
  if (loaded < total) {
    return false;
  } else if (loaded == total) {
    return true;
  } else {
    throw Error(`invalid total ${total}`);
  }
};

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
        DBCursorName: "robots",

        total: 0,
        ids: [],

        // INDEX
        filters: ROBOT.index.filters,
        sorts: ROBOT.index.sorts,
        offset: ROBOT.index.offset,
        limit: ROBOT.index.limit,
        // filterForm ???
        // filterFormErrors ???

        // FACETS
        havePendingRequests: monkey([
          ["ajaxQueue"],
          function (queue) {
            return ajaxQueueContains(queue, robotApi.indexUrl);
          }
        ]),
        fullLoad: monkey([
          ["UI", "robots", "total"],
          ["UI", "robots", "ids"],
          getFullLoad,
        ]),
        currentItems: monkey([
          ["DB", "robots"],
          ["UI", "robots"],
          getCurrentItems,
        ]),
      },
      robot: {
        DBCursorName: "robots",

        // CRUD
        id: undefined,
        addForm: {},
        addFormErrors: {},
        editForm: {},
        editFormErrors: {},

        currentItem: monkey([
          ["DB", "robots"],
          ["UI", "robot"],
          getCurrentItem,
        ]),
      },

      monsters: {
        DBCursorName: "monsters",

        total: 0,
        ids: [],

        // INDEX
        filters: MONSTER.index.filters,
        sorts: MONSTER.index.sorts,
        offset: MONSTER.index.offset,
        limit: MONSTER.index.limit,
        // filterForm ???
        // filterFormErrors ???

        // FACETS
        havePendingRequests: monkey([
          ["ajaxQueue"],
          function (queue) {
            return ajaxQueueContains(queue, monsterApi.indexUrl);
          }
        ]),
        fullLoad: monkey([
          ["UI", "monsters", "total"],
          ["UI", "monsters", "ids"],
          getFullLoad,
        ]),
        currentItems: monkey([
          ["DB", "monsters"],
          ["UI", "monsters"],
          getCurrentItems,
        ]),
      },
      monster: {
        DBCursorName: "monsters",

        // CRUD
        id: undefined,
        addForm: {},
        editForm: {},
        addFormErrors: {},
        editFormErrors: {},
        currentItem: monkey([
          ["DB", "monsters"],
          ["UI", "monster"],
          getCurrentItem,
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
