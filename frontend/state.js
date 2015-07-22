import {filter, find, identity, keys, map, pipe, propEq, slice, sortBy, tap, values} from "ramda";
import Baobab from "baobab";
import {flattenArrayObject, filterByAll, sortByAll} from "shared/helpers/common";
import {parseQuery} from "shared/helpers/jsonapi";
import {joiValidate} from "shared/helpers/validation";
import commonValidators from "shared/validators/common";
import robotApi from "shared/api/robot";
import monsterApi from "shared/api/robot";

// STATE ===========================================================================================
export const EXAMPLE = {
  FILTERS: undefined, // {published: true} || undefined
  SORTS: undefined,   // ["+publishedAt", "-id"] || undefined
  OFFSET: 0,          // 0 || -1
  LIMIT: 20,          // 10 || 20 || 50 ...
};

export const ROBOT = {
  FILTERS: undefined,
  SORTS: ["+name"],
  OFFSET: 0,
  LIMIT: 12,
};

export const MONSTER = {
  FILTERS: undefined,
  SORTS: ["+name"],
  OFFSET: 0,
  LIMIT: 12,
};

window._state = new Baobab(
  {
    url: {
      route: undefined,
      params: undefined,
      query: undefined,
    },

    ajaxQueue: [],

    robots: {
      // DATA
      total: 0,
      models: {},
      pagination: [],

      // INDEX
      filters: ROBOT.FILTERS,
      sorts: ROBOT.SORTS,
      offset: ROBOT.OFFSET,
      limit: ROBOT.LIMIT,

      // MODEL
      id: undefined,
    },

    monsters: {
      // DATA
      total: 0,
      models: {},
      pagination: [],

      // INDEX
      filters: ROBOT.FILTERS,
      sorts: ROBOT.SORTS,
      offset: ROBOT.OFFSET,
      limit: ROBOT.LIMIT,

      // MODEL
      id: undefined,
    },

    alerts: {
      // DATA
      total: 0,
      models: {},
    },

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

    $hasPendingRequestsRobot: [
      ["ajaxQueue"],
      function (queue) {
        return ajaxQueueContains(queue, robotApi.indexUrl) ||
               ajaxQueueContains(queue, robotApi.modelUrl);
      }
    ],

    $hasPendingRequestsMonster: [
      ["ajaxQueue"],
      function (queue) {
        return ajax.queueContains(queue, monsterApi.indexUrl) ||
               ajax.queueContains(queue, monsterApi.modelUrl);
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

    $currentAlerts: [
      ["alerts"],
      function (data) {
        let modelsArray = values(data.models);
        if (modelsArray.length) {
          return sortBy(m => m.createdDate, modelsArray);
        } else {
          return [];
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
  console.log(queue);
  return Boolean(filter(pendindRequest => pendindRequest.url == url, queue).length);
}
