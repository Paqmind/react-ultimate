// DEFAULTS ========================================================================================
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || "./shared/config";

// APP =============================================================================================
let Fs = require("fs");
let Path = require("path");
let Express = require("express");
let Config = require("config");
require("shared/shims");

let app = Express();
app.set("etag", Config.get("http-use-etag"));

// LOGGER ==========================================================================================
let logger = require("backend/logger");

// TEMPLATES =======================================================================================
app.set("views", Path.join(__dirname, "templates"));
app.set("view engine", "html");

let Nunjucks = require("nunjucks");
let nunjucksEnv = Nunjucks.configure("backend/templates", {
  autoescape: true,
  express: app
});

// MIDDLEWARES =====================================================================================
let Morgan = require("morgan");
let CookieParser = require("cookie-parser");
let BodyParser = require("body-parser");

app.use(CookieParser());
app.use(BodyParser.json());                        // parse application/json
app.use(BodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded

app.use(Morgan("dev", {
  skip: function (req, res) {
    return req.originalUrl.includes("/static") || req.originalUrl.includes("/favicon");
  }
}));

let appRouter = require("backend/common/router");
require("backend/common/routes");

let apiRouter = require("backend/robot/router");
require("backend/robot/routes");

let staticRouter = Express.static("static", {etag: Config.get("http-use-etag")});

//app.use(favicon(__dirname + "/favicon.ico"));
app.use("/static", staticRouter);
app.use("/api", apiRouter);
app.use("/", appRouter);

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
let Http = require("http");

let server = Http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(Config.get("http-port"));
//var socketEngine = SocketIO(server);

// SOCKET-IO =======================================================================================
let ChildProcess = require("child_process");
let SocketIO = require("socket.io");
let SocketIOStream = require("socket.io-stream");
//let exec  = ChildProcess.exec,
//let spawn = ChildProcess.spawn;

/*socketEngine.sockets.on("connection", function (socket) {
  console.log("[]-> connection");
  var logFile = Path.join(Config.get("project-dir"), "log-osx.log");
  ss(socket).on("enter", function (stream, data) {
    var top = spawn("top", ["-l 0"]);
    top.stderr.on("data", function (data) {
      console.log("ps stderr: " + data);
    });
    console.log("[]-> enter:");
    console.log(`[]-> piping ${logFile}`);
//    top.stdout.pipe(stream);
//    console.log("[]-> enter:", Path.join(Config.get("project-dir"), "log-osx.log"));
    Fs.createReadStream(logFile).pipe(stream);
  });

//  ss(socket).emit("streaming", top.stdout);
//  socket.emit("message", {message: "Welcome to the chat!"});

//  socket.on("message", function (data) {
//    socket.broadcast.emit("message", {message: data});
//    socket.emit("message", {message: data});
//  });

//  socket.on("enter", function (data) {
//    socket.username = data.username;
//    socketEngine.sockets.emit("message", {message: data.username + " enters the chat"});
//  });

//  socket.on("disconnect", function () {
//    socketEngine.sockets.emit("message", {message: socket.username + " leaves the chat"});
//  });
});*/

/*
// all environments
app.set('title', 'Application Title');

// development only
if (app.get('env') == "development") {
  app.use(Express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('mongodb_uri', 'mongo://localhost/dev');
  mongo.connect('development',logger); // mongodb initialization
}

// production only
if (app.get('env') == "production") {
  app.use(Express.errorHandler());
  app.set('mongodb_uri', 'mongo://localhost/prod');
  mongo.connect('production',logger); // mongodb initialization
}
*/

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

/*process.on('uncaughtException', function (err) {
console.error('uncaughtException:', err.message)
console.error(err.stack)
process.exit(1)})*/
