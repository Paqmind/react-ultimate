var Collection = require("ampersand-collection");

var Process = require("./model");

module.exports = Collection.extend({
  model: Process,
});
