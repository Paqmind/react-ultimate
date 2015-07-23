import {filter, find, forEach, identity, keys, map, pipe, propEq, slice, sortBy, tap, values} from "ramda";
import Baobab from "baobab";
import throttle from "lodash.throttle";
import {flattenArrayObject, filterByAll, sortByAll} from "shared/helpers/common";
import {parseQuery} from "shared/helpers/jsonapi";
import {joiValidate} from "shared/helpers/validation";
import commonValidators from "shared/validators/common";
import robotApi from "shared/api/robot";
import monsterApi from "shared/api/robot";
import {ALERT, ROBOT, MONSTER} from "frontend/constants";

// STATE ===========================================================================================
window._state = new Baobab(
  {
    url: {
      route: undefined,
      path: undefined,
      params: undefined,
      query: undefined,
    },

    ajaxQueue: [],

    alertQueue: [],
    alertTimeout: undefined,

    robots: {
      // DATA
      total: 0,
      models: {},
      pagination: [],

      // INDEX
      filters: ROBOT.index.filters,
      sorts: ROBOT.index.sorts,
      offset: ROBOT.index.offset,
      limit: ROBOT.index.limit,

      // MODEL
      id: undefined,
    },

    monsters: {
      // DATA
      total: 0,
      models: {},
      pagination: [],

      // INDEX
      filters: MONSTER.index.filters,
      sorts: MONSTER.index.sorts,
      offset: MONSTER.index.offset,
      limit: MONSTER.index.limit,

      // MODEL
      id: undefined,
    },

    $havePendingRequestsRobot: [
      ["ajaxQueue"],
      function (queue) {
        return ajaxQueueContains(queue, robotApi.indexUrl);
      }
    ],

    $havePendingRequestsMonster: [
      ["ajaxQueue"],
      function (queue) {
        return ajaxQueueContains(queue, monsterApi.indexUrl);
      }
    ],

    $urlQuery: [
      ["url", "query"],
      function (query) {
        // Parse and validate URL Query
        let parsedQuery = parseQuery(query);
        let [cleanedQuery, errors] = joiValidate(parsedQuery, commonValidators.urlQuery);
        if (keys(errors).length) {
          let humanReadableErrors = flattenArrayObject(errors).join(", ");
          alert(`Invalid URL query params. Errors: ${humanReadableErrors}`);
          throw Error(`Invalid URL query params. Errors: ${humanReadableErrors}`);
        }

        return {
          filters: cleanedQuery.filters,
          sorts: cleanedQuery.sorts,
          offset: cleanedQuery.offset,
          limit: cleanedQuery.limit,
        };
      }
    ],

    // Quick hack until Form will be implemented as Component
    $emptyRobot: [
      ["url"],
      function (url) {
        return {
          name: undefined,
          //assemblyDate: undefined,
          manufacturer: undefined,
        };
      }
    ],

    // Quick hack until Form will be implemented as Component
    $emptyMonster: [
      ["url"],
      function (url) {
        return {
          name: undefined,
          //birthDate: undefined,
          citizenship: undefined,
        };
      }
    ],

    $allRobotsAreLoaded: [
      ["robots", "total"],
      ["robots", "pagination"],
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
    ],

    $allMonstersAreLoaded: [
      ["monsters", "total"],
      ["monsters", "pagination"],
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
    ],

    $currentRobot: [
      ["robots", "models"],
      ["robots", "id"],
      function (models, id) {
        if (id) {
          return models[id];
        } else {
          return;
        }
      }
    ],

    $currentMonster: [
      ["monsters", "models"],
      ["monsters", "id"],
      function (models, id) {
        if (id) {
          return models[id];
        } else {
          return;
        }
      }
    ],

    $currentRobots: [
      ["robots"],
      ["$allRobotsAreLoaded"],
      function (data, fullLoad) {
        let {filters, sorts, offset, limit, models, pagination} = data;
        let modelsArray = map(id => id && models[id], pagination);
        return pipe(
          fullLoad ? filterByAll(filters) : identity,
          fullLoad ? sortByAll(sorts) : identity,
          slice(offset, offset + limit),
          filter(m => m)
        )(modelsArray);
      }
    ],

    $currentMonsters: [
      ["monsters"],
      ["$allMonstersAreLoaded"],
      function (data, fullLoad) {
        let {filters, sorts, offset, limit, models, pagination} = data;
        let modelsArray = map(id => id && models[id], pagination);
        return pipe(
          fullLoad ? filterByAll(filters) : identity,
          fullLoad ? sortByAll(sorts) : identity,
          slice(offset, offset + limit),
          filter(m => m)
        )(modelsArray);
      }
    ],
  },
  { // OPTIONS
    immutable: false
  }
);

export default window._state;

// HELPERS =========================================================================================
function ajaxQueueContains(queue, url) {
  return Boolean(filter(pendindRequest => pendindRequest.url.startsWith(url), queue).length);
}
