// IMPORTS =========================================================================================
import {filter, find, identity, keys, map, pipe, propEq, slice, sortBy, tap, values} from "ramda";
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
      //  get(data) {
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

        get(data) {
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

        get(data) {
          return {
            name: undefined,
            //birthDate: undefined,
            citizenship: undefined,
          };
        }
      },

      allRobotsAreLoaded: {
        cursors: {
          total: ["robots", "total"],
          pagination: ["robots", "pagination"],
        },

        get(data) {
          let {total, pagination} = data;
          let loaded = filter(id => id, pagination).length;
          if (loaded < total) {
            return false;
          } else if (loaded == total) {
            return true;
          } else {
            throw Error(`invalid total ${total}`);
          }
        }
      },

      allMonstersAreLoaded: {
        cursors: {
          total: ["monsters", "total"],
          pagination: ["monsters", "pagination"],
        },

        get(data) {
          let {total, pagination} = data;
          let loaded = filter(id => id, pagination).length;
          if (loaded < total) {
            return false;
          } else if (loaded == total) {
            return true;
          } else {
            throw Error(`invalid total ${total}`);
          }
        }
      },

      currentRobot: {
        cursors: {
          robots: "robots",
        },

        get(data) {
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

        get(data) {
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

        get(data) {
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

        facets: {
          allModelsAreLoaded: "allRobotsAreLoaded",
        },

        get(data) {
          let {robots, allModelsAreLoaded} = data;
          let {filters, sorts, offset, limit, models, pagination} = robots;
          let modelsArray = map(id => id && models[id], pagination);
          return pipe(
            allModelsAreLoaded ? filterByAll(filters) : identity,
            allModelsAreLoaded ? sortByAll(sorts) : identity,
            slice(offset, offset + limit),
            filter(m => m)
          )(modelsArray);
        }
      },

      currentMonsters: {
        cursors: {
          monsters: "monsters",
        },

        facets: {
          allModelsAreLoaded: "allMonstersAreLoaded",
        },

        get(data) {
          let {monsters, allModelsAreLoaded} = data;
          let {filters, sorts, offset, limit, models, pagination} = monsters;
          let modelsArray = map(id => id && models[id], pagination);
          return pipe(
            allModelsAreLoaded ? filterByAll(filters) : identity,
            allModelsAreLoaded ? sortByAll(sorts) : identity,
            slice(offset, offset + limit),
            filter(m => m)
          )(modelsArray);
        }
      },
    }
  }
);

export default window._state;
