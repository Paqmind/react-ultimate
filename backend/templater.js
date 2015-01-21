let path = require("path");
let nunjucks = require("nunjucks");
let markdown = require("nunjucks-markdown");
let marked = require("marked");

module.exports = function(app) {
  app.set("views", path.join(__dirname, "templates"));
  app.set("view engine", "html");

  let env = nunjucks.configure("backend/templates", {
    autoescape: true,
    express: app
  });

  env.lazyRender = function(name) {
    return nunjucks.render.bind(nunjucks, name);
  };

  markdown.register(env, {
  //  renderer: new marked.Renderer(),
  //  breaks: false,
  //  pedantic: false,
  //  smartLists: true,
    smartypants: true
  });

  return env;
};
