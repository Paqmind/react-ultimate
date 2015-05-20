/**
 * Note: imports are statically hoisted at compile time
 * and splitted on sections only to improve readability
 * in this complex file.
 */
// APP =============================================================================================
import "shared/env";
import "shared/shims";
import Fs from "fs";
import Express from "express";
import Config from "config";

let app = Express();
app.set("etag", Config.get("http-use-etag"));

// LOGGER ==========================================================================================
import logger from "backend/logger";

// TEMPLATES =======================================================================================
import templater from "backend/templater";
templater(app);

// MIDDLEWARES =====================================================================================
import Compression from "compression";
import Morgan from "morgan";
import CookieParser from "cookie-parser";
import BodyParser from "body-parser";

app.use(Compression());
app.use(CookieParser());
app.use(BodyParser.json());                        // parse application/json
app.use(BodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded

app.use(Morgan("dev", {
  skip: function (req, res) {
    return req.originalUrl.includes("/public") || req.originalUrl.includes("/favicon");
  }
}));

import commonRouter from "./routers/common";
import "backend/actions/common";

import alertRouter from "./routers/alert";
import "backend/actions/alert";

import robotRouter from "./routers/robot";
import "backend/actions/robot";

import monsterRouter from "./routers/monster";
import "backend/actions/monster";

let staticRouter = Express.static("public", {etag: Config.get("http-use-etag")});

//app.use(favicon(__dirname + "/favicon.ico"));
app.use("/public", staticRouter);
app.use("/api/alerts", alertRouter);
app.use("/api/robots", robotRouter);
app.use("/api/monsters", monsterRouter);
app.use("/", commonRouter);

app.use(function (req, res, cb) {
  res.status(404).render("errors/404.html");
});

app.use(function (err, req, res, cb) {
  logger.error(err.stack);
  res.status(err.status || 500);
  res.render("errors/500.html", {
    message: err.message,
    error: (app.get("env") == "development") ? err : {}
  });
});

// LISTENERS =======================================================================================
import Http from "http";

let server = Http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(Config.get("http-port"));

// HELPERS =========================================================================================
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      logger.error(Config.get("http-port") + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(Config.get("http-port") + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  logger.info("Listening on port " + Config.get("http-port"));
}
