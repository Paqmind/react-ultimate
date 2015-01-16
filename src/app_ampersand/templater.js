var nunjucks = require("nunjucks");

// CONFIG
module.exports = nunjucks.configure("/static/scripts/templates", {
  autoescape: true
});

// MONKEY-PATCH
module.exports.lazyRender = function(name) {
  return nunjucks.render.bind(nunjucks, name);
};
