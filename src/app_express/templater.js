var path = require("path"),
    nunjucks = require("nunjucks"),
    markdown = require("nunjucks-markdown"),
    marked = require("marked");

module.exports = function(app) {
  app.set("views", path.join(__dirname, "templates"));
  app.set("view engine", "html");

  let env = nunjucks.configure("src/app_express/templates", {
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
