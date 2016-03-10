let {Subject} = require("rx");

module.exports = {
  robots: {
    data: new Subject(),
    fullLoad: new Subject(),
    // ...
    // have pending requests, etc.
  },

  monsters: {
    data: new Subject(),
    fullLoad: new Subject(),
    // ...
    // have pending requests, etc.
  },
};