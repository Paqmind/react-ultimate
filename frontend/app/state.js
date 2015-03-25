// IMPORTS =========================================================================================
let Baobab = require("baobab");

// STATE ===========================================================================================
export default new Baobab({
  robots: {
    models: {},
    loaded: false,
    loadError: undefined,
  },
  alerts: {
    models: {},
    loaded: false,
    loadError: null,
  },
});