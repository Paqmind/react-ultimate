/**
 * Note: imports are statically hoisted at compile time
 * and splitted on sections only to improve readability
 * in this complex file.
 */
import "shared/shims";
import Fs from "fs";
import Path from "path";
import Express from "express";

// CONSTANTS =======================================================================================
const PROJECT_DIR = Path.dirname(__dirname);
const NODE_MODULES_DIR = Path.join(PROJECT_DIR, "node_modules");
const SHARED_DIR = Path.join(PROJECT_DIR, "shared");
const FRONTEND_DIR = Path.join(PROJECT_DIR, "frontend");
const BACKEND_DIR = Path.join(PROJECT_DIR, "backend");
const PUBLIC_DIR = Path.join(PROJECT_DIR, "public");

// APP =============================================================================================
let app = Express();

app.set("etag", Boolean(process.env.HTTP_USE_ETAG));

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

if (process.env.NODE_ENV != "testing") {
  app.use(Morgan("dev", {
    skip: function (req, res) {
      return req.originalUrl.includes("/public");
    }
  }));
}

import commonRouter from "./routers/common";
import "backend/pages/app";

import alertRouter from "./routers/alert";
import "backend/actions/alert";

import robotRouter from "./routers/robot";
import "backend/actions/robot";

import monsterRouter from "./routers/monster";
import "backend/actions/monster";

let staticRouter = Express.static("public", {etag: false});

app.use("/public", staticRouter);
app.use("/api/alerts", alertRouter);
app.use("/api/robots", robotRouter);
app.use("/api/monsters", monsterRouter);
app.use("/", commonRouter);

app.use((req, res, cb) => {
  res.status(404).sendFile(Path.join(PUBLIC_DIR, "errors/404.html"));
});

app.use((err, req, res, cb) => {
  logger.error(err.stack);
  res.status(err.status || 500).sendFile(Path.join(PUBLIC_DIR, "errors/500.html"));
});

export default app;
