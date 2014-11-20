"use strict";

var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var nunjucks = require("nunjucks");
var markdown = require("nunjucks-markdown");
var marked = require("marked");

var routes = require("./routes");

var app = express();

var projectDir = path.dirname(path.dirname(__dirname));
var srcDir = path.join(projectDir, "src");
var distDir = path.join(projectDir, "dist");

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "html");

var nunjucksEnv = nunjucks.configure("express-app/templates", {
  autoescape: true,
  express: app
});
//module.exports.lazyRender = function(name) {
//  return nunjucks.render.bind(nunjucks, name);
//};

markdown.register(nunjucksEnv, {
//  renderer: new marked.Renderer(),
//  breaks: false,
//  pedantic: false,
//  smartLists: true,
  smartypants: true
});

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", routes);
app.use("/assets", express.static(path.join(path.dirname(__dirname), "assets")));
//app.use(favicon(__dirname + "/public/favicon.ico"));

// ERROR HANDLERS ==================================================================================
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

module.exports = app;


/*
app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mongo.connect('development',logger); // mongodb initialization
});

app.configure('production', function () {
  app.use(express.errorHandler());
  mongo.connect('production',logger); // mongodb initialization
});*/
