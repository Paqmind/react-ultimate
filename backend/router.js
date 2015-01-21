var path = require("path"),
    conf = require("config"),
    express = require("express");

var routes = require("./routes/index");
routes.static = express.static("static", {etag: conf.get("use-etag")});

module.exports = function(app) {
  //app.use(favicon(__dirname + "/favicon.ico"));
  app.use("/static", routes.static);
  app.use("/api", routes.api);
  app.use("/", routes.app);

  app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: (app.get("env") === "development") ? err : {}
    });
  });
};
