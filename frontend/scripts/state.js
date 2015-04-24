// IMPORTS =========================================================================================
let Baobab = require("baobab");
let {toArray} = require("frontend/common/helpers");

// STATE ===========================================================================================
export default new Baobab(
  { // DATA
    url: {
      handler: undefined,
      id: undefined,
      page: undefined,
      filters: undefined,
      sorts: undefined,
    },

    robots: {
      models: {},
      total: 0,
      loading: true,
      loadError: undefined,
      pagination: [], // in format [[A B C], [D E]...], e.g. offset <-> ids
      perpage: 5,
    },

    alerts: {
      models: {},
      total: 0,
      loading: true,
      loadError: undefined,
      pagination: [], // in format [[A B C], [D E]...], e.g. offset <-> ids
      perpage: 5,
    },
  },
  { // OPTIONS
    facets: {
      currentRobot: {
        cursors: {
          url: ["url"],
          models: ["robots", "models"],
        },
        get: function(data) {
          let {url, models} = data;
          let model;
          if (url.id) {
            model = models[url.id];
          }
          return model;
        }
      },

      currentRobots: {
        cursors: {
          url: ["url"],
          models: ["robots", "models"],
          pagination: ["robots", "pagination"],
          // TODO filters, sorts
        },
        get: function(data) {
          let {url, models, pagination} = data;
          models = toArray(models);

          if (url.page) {
            let ids = pagination[url.page];
            if (ids) {
              models = models.filter(model => ids.indexOf(model.id) != -1);
            }
          }
          if (url.filters) {
            // TODO client filters
            // if server filters are required:
            // reset pagination in filtering action
          }
          if (url.sorts) {
            // TODO client-sorts
            // if server sorts are required:
            // reset pagination in sorting action
          }
          return models;
        }
      }
    }
  }
);
