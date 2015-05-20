// IMPORTS =========================================================================================
import {filter, keys, map, pipe, sortBy} from "ramda";
import Baobab from "baobab";
import {flattenArrayObject} from "shared/helpers/common";
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
  FILTERS: {},
  SORTS: ["+name"],
  OFFSET: 0,
  LIMIT: 12,
};

export const MONSTER = {
  FILTERS: {},
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
          let {total, models} = data.alerts;
          let ids = keys(models);
          if (ids) {
            ids = sortBy(m => m.createdDate, ids);
            return map(id => models[id], ids);
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
          let {models, pagination, offset, limit} = data.robots;
          // TODO replace recalculateWithFilters => filterByAll here
          // TODO replace recalculateWithSorts => sortByAll here
          let ids = filter(m => m, pagination.slice(offset, offset + limit));
          if (ids) {
            return map(id => models[id], ids);
          } else {
            return [];
          }
        }
      },

      currentMonsters: {
        cursors: {
          monsters: "monsters",
        },

        get: function (data) {
          let {models, pagination, offset, limit} = data.monsters;
          // TODO replace recalculateWithFilters => filterByAll here
          // TODO replace recalculateWithSorts => sortByAll here
          let ids = filter(m => m, pagination.slice(offset, offset + limit));
          if (ids) {
            return map(id => models[id], ids);
          } else {
            return [];
          }
        }
      },
    }
  }
);

export default window._state;
