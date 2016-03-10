let {indexView} = require("./lib");
let stateDB = require("./state.db");
let stateUI = require("./state.ui");

module.exports = {
  robotIndex: indexView(stateDB.robots.data, stateUI.robotIndex),
  newRobotIndex: indexView(stateDB.robots.data, stateUI.newRobotIndex),
  monsterIndex: indexView(stateDB.monsters.data, stateUI.monsterIndex),
};