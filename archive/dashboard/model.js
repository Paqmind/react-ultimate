var State = require("ampersand-state");

var Processes = require("../process/collection"),
    Summary = require("../summary/model");

module.exports = State.extend({
  children: {
    summary: Summary,
  },

  collections: {
    processes: Processes,
  },
});
