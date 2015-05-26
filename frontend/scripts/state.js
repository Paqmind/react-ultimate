// IMPORTS =========================================================================================
import {filter, find, keys, map, pipe, propEq, slice, sortBy, tap, values} from "ramda";
import Baobab from "baobab";
import {flattenArrayObject, filterByAll, sortByAll} from "shared/helpers/common";
import {parseQuery} from "shared/helpers/jsonapi";
import {joiValidate} from "shared/helpers/validation";
import commonValidators from "shared/validators/common";

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
  { // DATA
    url: {
      handler: undefined,
      params: undefined,
      query: undefined,
      id: undefined,
      filters: undefined,
      sorts: undefined,
      offset: undefined,
      limit: undefined,
    },

    robots: {
      // DATA
      total: 0,
      models: {},
      pagination: [],

      // LOAD ARTEFACTS
      loading: true,
      loadError: undefined,

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

      // LOAD ARTEFACTS
      loading: true,
      loadError: undefined,

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

      // LOAD ARTEFACTS
      loading: true,
      loadError: undefined,
    },
  },
  { // OPTIONS
    syncwrite: true,

    facets: {
      //urlQuery: {
      //  cursors: {
      //    query: ["url", "query"],
      //  },
      //
      //  get: function (data) {
      //    let query = data.query;
      //
      //    // Parse and validate URL Query
      //    let parsedQuery = parseQuery(query);
      //    let [cleanedQuery, errors] = joiValidate(parsedQuery, commonValidators.urlQuery);
      //    if (keys(errors).length) {
      //      let humanReadableErrors = flattenArrayObject(errors).join(", ");
      //      alert(`Invalid URL query params. Errors: ${humanReadableErrors}`);
      //      throw Error(`Invalid URL query params. Errors: ${humanReadableErrors}`);
      //    }
      //
      //    return {
      //      filters: cleanedQuery.filters,
      //      sorts: cleanedQuery.sorts,
      //      offset: cleanedQuery.offset,
      //      limit: cleanedQuery.limit,
      //    };
      //  }
      //},

      // Quick hack until Form will be implemented as Component
      emptyRobot: {
        cursors: {
          url: ["url"],
        },

        get: function (data) {
          return {
            name: undefined,
            //assemblyDate: undefined,
            manufacturer: undefined,
          };
        }
      },

      // Quick hack until Form will be implemented as Component
      emptyMonster: {
        cursors: {
          url: ["url"],
        },

        get: function (data) {
          return {
            name: undefined,
            //birthDate: undefined,
            citizenship: undefined,
          };
        }
      },

      currentRobot: {
        cursors: {
          robots: "robots",
        },

        get: function (data) {
          let {models, id} = data.robots;
          if (id) {
            return models[id];
          } else {
            return undefined;
          }
        }
      },

      currentMonster: {
        cursors: {
          monsters: "monsters",
        },

        get: function (data) {
          let {models, id} = data.monsters;
          if (id) {
            return models[id];
          } else {
            return undefined;
          }
        }
      },

      currentAlerts: {
        cursors: {
          alerts: "alerts",
        },

        get: function (data) {
          let {models} = data.alerts;
          let modelsArray = values(models);
          if (modelsArray.length) {
            return sortBy(m => m.createdDate, modelsArray);
          } else {
            return [];
          }
        }
      },

      currentRobots: {
        cursors: {
          robots: "robots",
        },

        get: function (data) {
          let {filters, sorts, offset, limit, models, pagination} = data.robots;
          let modelsArray = map(id => id && models[id], pagination);
          return pipe(
            filterByAll(filters),
            sortByAll(sorts),
            slice(offset, offset + limit),
            filter(m => m)
          )(modelsArray);
        }
      },

      currentMonsters: {
        cursors: {
          monsters: "monsters",
        },

        get: function (data) {
          let {filters, sorts, offset, limit, models, pagination} = data.monsters;
          let modelsArray = map(id => id && models[id], pagination);
          return pipe(
            filterByAll(filters),
            sortByAll(sorts),
            slice(offset, offset + limit),
            filter(m => m)
          )(modelsArray);
        }
      },
    }
  }
);

export default window._state;
