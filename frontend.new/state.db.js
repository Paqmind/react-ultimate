let {store} = require("./lib");     // state lib of state helpers
let update = require("./update.db");

let defaults = {
  // ...
};

module.exports = {
  defaults,

  robots: {
    data: store({}, update.robots.data),
    fullLoad: store(false, update.robots.fullLoad),
    // ...
    // have pending requests, etc.
  },

  monsters: {
    data: store({}, update.monsters.data),
    fullLoad: store(false, update.monsters.fullLoad),
    // ...
    // have pending requests, etc.
  },
};