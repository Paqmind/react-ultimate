var Collection = require("ampersand-rest-collection");

var Robot = require("./model");

module.exports = Collection.extend({
  model: Robot,

  url: "/api/robots"
});
