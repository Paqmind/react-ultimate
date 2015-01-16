var State = require("ampersand-state");

module.exports = State.extend({
  session: {
    processes: {type: "string"},
    loadavg: {type: "string"},
    sharedlibs: {type: "string"},
    memregions: {type: "string"},
    physmem: {type: "string"},
    vm: {type: "string"},
    networks: {type: "string"},
    disks: {type: "string"},
  },
});
