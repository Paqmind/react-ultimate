let {Subject} = require("rx");

module.exports = {
  robotIndex: {
    filters: new Subject(),
    sort: new Subject(),
    offset: new Subject(),
    limit: new Subject(),
  },

  monsterIndex: {
    filters: new Subject(),
    sort: new Subject(),
    offset: new Subject(),
    limit: new Subject(),
  },
};