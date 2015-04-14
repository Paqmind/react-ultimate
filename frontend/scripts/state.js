// IMPORTS =========================================================================================
let Baobab = require("baobab");

// STATE ===========================================================================================
export default new Baobab({
  robots: {
    models: {},
    modelIds: [1, 2, 3, 4, 5],
    total: 0,
    loading: true,
    loadError: undefined,
  },
  alerts: {
    models: {},
    total: 0,
    loading: true,
    loadError: undefined,
  },
});
