let {Observable} = require("rx");
let {indexView, store} = require("./lib");
let updateUI = require("./update.ui");
let stateDB = require("./state.db");

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

let stateUI = {
  defaults,

  robotIndex: {
    filters: store(defaults.robotIndex.filters, updateUI.robotIndex.filters),
    sort: store(defaults.robotIndex.sort, updateUI.robotIndex.sort),
    offset: store(0, updateUI.robotIndex.offset),
    limit: store(defaults.robotIndex.limit, updateUI.robotIndex.limit),
  },

  newRobotIndex: {
    filters: Observable.of(defaults.newRobotIndex.filters),
    sort:  Observable.of(defaults.newRobotIndex.sort),
    offset:  Observable.of(0),
    limit:  Observable.of(defaults.newRobotIndex.limit),
  },

  monsterIndex: {
    filters: store(defaults.monsterIndex.filters, updateUI.monsterIndex.filters),
    sort: store(defaults.monsterIndex.sort, updateUI.monsterIndex.sort),
    offset: store(0, updateUI.monsterIndex.offset),
    limit: store(defaults.monsterIndex.limit, updateUI.monsterIndex.limit),
  },
};

stateUI.robotIndex = indexView(stateDB.robots.data, stateUI.robotIndex);
stateUI.newRobotIndex = indexView(stateDB.robots.data, stateUI.newRobotIndex);
stateUI.monsterIndex = indexView(stateDB.monsters.data, stateUI.monsterIndex);

module.exports = stateUI;

