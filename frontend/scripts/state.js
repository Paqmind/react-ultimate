// IMPORTS =========================================================================================
import {filter, map} from "ramda";
import Baobab from "baobab";

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

export const MONSTER = {
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
      reset: undefined,
    },

    robots: {
      // DATA
      models: {},
      total: 0,
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
      models: {},
      total: 0,
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
      models: {},
      total: 0,
      pagination: [],

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
    syncwrite: true,

    facets: {
      // TODO wee need nested (namespaced) facets. Post an issue
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

      currentRobots: {
        cursors: {
          robots: "robots",
        },

        get: function (data) {
          let {models, pagination, offset, limit} = data.robots;
          let ids = filter(v => v, pagination.slice(offset, offset + limit));
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
          let ids = filter(v => v, pagination.slice(offset, offset + limit));
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