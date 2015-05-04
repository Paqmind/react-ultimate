// IMPORTS =========================================================================================
import Baobab from "baobab";
import {flattenArrayGroup} from "shared/helpers";

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
  LIMIT: 5,
};

export const ZOMBIE = {
  FILTERS: {},
  SORTS: ["+name"],
  OFFSET: 0,
  LIMIT: 5,
};

export const ALERT = {
  FILTERS: {},
  SORTS: ["+createdOn"],
  OFFSET: 0,
  LIMIT: 5,
}

export default new Baobab(
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
      reset: undefined,
    },

    robots: {
      // DATA
      models: {},
      total: 0,
      pagination: {},

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
      models: {},
      total: 0,
      pagination: {},

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
      models: {},
      total: 0,
      pagination: {},

      // LOAD ARTEFACTS
      loading: true,
      loadError: undefined,

      // INDEX
      filters: ALERT.FILTERS,
      sorts: ALERT.SORTS,
      offset: ALERT.OFFSET,
      limit: ALERT.LIMIT,

      // MODEL
      id: undefined,
    },
  },
  { // OPTIONS
    facets: {
      allRobotsAreLoaded: {
        cursors: {
          robots: "robots",
        },

        get: function (data) {
          let {pagination, total} = data.robots;
          if (flattenArrayGroup(pagination).length) {
            return flattenArrayGroup(pagination).length >= total;
          } else {
            return false;
          }
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

      currentRobots: {
        cursors: {
          robots: "robots",
        },

        get: function (data) {
          let {models, pagination, offset} = data.robots;
          let ids = pagination[offset];
          if (ids) {
            return ids.map(id => models[id]);
          } else {
            return [];
          }
        }
      }
    }
  }
);

/*
Change filters:
  //if pagination.length < total:
  //  purge pagination!
  fetch!
  redirect to offset = 0!

Change sorts:
  //if pagination.length < total:
  //  purge pagination!
  fetch!
  redirect to offset = 0!

Change offset:
  //if can't be loaded:
  //  fetch!
  // update pagination
  redirect to new offset!

Change limit:
  redirect to offset = 0! || rebuild pagination and if can't be loaded: fetch
*/