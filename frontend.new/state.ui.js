let {Observable} = require("rx");
let {store} = require("./lib");     // state lib of state helpers
let update = require("./update.ui");

let defaults = {
  robotIndex: {
    filters: {},
    sort: "+id",
    limit: 10,
  },

  newRobotIndex: {
    filters: {"new": true},
    sort: "-id",
    limit: 5,
  },

  monsterIndex: {
    filters: {},
    sort: "+id",
    limit: 10,
  },
};

module.exports = {
  defaults,

  robotIndex: {
    filters: store(defaults.robotIndex.filters, update.robotIndex.filters),
    sort: store(defaults.robotIndex.sort, update.robotIndex.sort),
    offset: store(0, update.robotIndex.offset),
    limit: store(defaults.robotIndex.limit, update.robotIndex.limit),
  },

  newRobotIndex: {
    filters: Observable.of(defaults.newRobotIndex.filters),
    sort:  Observable.of(defaults.newRobotIndex.sort),
    offset:  Observable.of(0),
    limit:  Observable.of(defaults.newRobotIndex.limit),
  },

  monsterIndex: {
    filters: store(defaults.monsterIndex.filters, update.monsterIndex.filters),
    sort: store(defaults.monsterIndex.sort, update.monsterIndex.sort),
    offset: store(0, update.monsterIndex.offset),
    limit: store(defaults.monsterIndex.limit, update.monsterIndex.limit),
  },
};