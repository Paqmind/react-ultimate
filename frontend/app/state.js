// IMPORTS =========================================================================================
let Baobab = require("baobab");

// STATE ===========================================================================================
export default new Baobab({
  robots: {
    models: {},
    loading: true,
    loadError: undefined,
  },
  alerts: {
    models: {},
    loading: true,
    loadError: null,
  },
});