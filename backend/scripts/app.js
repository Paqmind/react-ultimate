// DEFAULTS ========================================================================================
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || "./shared/config";

// IMPORTS =========================================================================================
let Fs = require("fs");
let Path = require("path");
let Http = require("http");
let Util = require("util");
let ChildProcess = require("child_process");
let Config = require("config");
let Express = require("express");
let SocketIO = require("socket.io");
let SocketIOStream = require("socket.io-stream");
let Morgan = require("morgan");
let CookieParser = require("cookie-parser");
let BodyParser = require("body-parser");
let Nunjucks = require("nunjucks");
let Markdown = require("nunjucks-markdown");
let Marked = require("marked");
let Winston = require("winston");
let WinstonMail = require("winston-mail");
let Moment = require("moment");
let Routes = require("./routes/index");

// APPS & SERVERS ----------------------------------------------------------------------------------
let app = Express();

// Configs
app.set("etag", Config.get("http-use-etag"));

// Middlewares
app.use(BodyParser.json());                        // parse application/json
app.use(BodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded

app.use(Morgan("dev", {
  skip: function (req, res) {
    return req.originalUrl.includes("/static") || req.originalUrl.includes("/favicon");
  }
}));

/*app.use(cookieParser());*/
let port = process.env.PORT || "3000";
let server = Http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
//var socketEngine = SocketIO(server);

// SOCKET-IO ---------------------------------------------------------------------------------------
//let exec  = ChildProcess.exec,
//let spawn = ChildProcess.spawn;

/*socketEngine.sockets.on("connection", function(socket) {
  console.log("[]-> connection");
  var logFile = Path.join(Config.get("project-dir"), "log-osx.log");
  ss(socket).on("enter", function(stream, data) {
    var top = spawn("top", ["-l 0"]);
    top.stderr.on("data", function(data) {
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

//  socket.on("message", function(data) {
//    socket.broadcast.emit("message", {message: data});
//    socket.emit("message", {message: data});
//  });

//  socket.on("enter", function(data) {
//    socket.username = data.username;
//    socketEngine.sockets.emit("message", {message: data.username + " enters the chat"});
//  });

//  socket.on("disconnect", function() {
//    socketEngine.sockets.emit("message", {message: socket.username + " leaves the chat"});
//  });
});*/

// TEMPLATES =======================================================================================
app.set("views", Path.join(__dirname, "templates"));
app.set("view engine", "html");

let nunjucksEnv = Nunjucks.configure("backend/scripts/templates", {
  autoescape: true,
  express: app
});

Markdown.register(nunjucksEnv, {
//  renderer: new Marked.Renderer(),
//  breaks: false,
//  pedantic: false,
//  smartLists: true,
  smartypants: true
});

// ROUTES ==========================================================================================
Routes.static = Express.static("static", {etag: Config.get("http-use-etag")});

//app.use(favicon(__dirname + "/favicon.ico"));
app.use("/static", Routes.static);
app.use("/api", Routes.api);
app.use("/", Routes.app);

app.use(function(req, res, next) {
  res.status(404).render("errors/404.html");
});

app.use(function(err, req, res, next) {
  logger.error(err.stack);
  res.status(err.status || 500);
  res.render("errors/500.html", {
    message: err.message,
    error: (app.get("env") == "development") ? err : {}
  });
});

// LOGGING =========================================================================================
let customColors = {
  trace: "white",
  debug: "blue",
  info: "green",
  warn: "yellow",
  fatal: "red"
};

let customLevels = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
};

Winston.addColors(customColors);

let logger = new (Winston.Logger)({
  colors: customColors,
  levels: customLevels,
  transports: [
    new (Winston.transports.Console)({
      level: process.env.NODE_ENV == "development" ? "info" : "warn",
      colorize: true,
      timestamp: function() {
        return Moment();
      },
      formatter: function(options) {
        let timestamp = options.timestamp().format("YYYY-MM-DD hh:mm:ss");
        let level = Winston.config.colorize(options.level, options.level.toUpperCase());
        let message = options.message;
        let meta;
        if (options.meta instanceof Error) {
          meta = "\n  " + options.meta.stack;
        } else {
          meta = Object.keys(options.meta).length ? Util.inspect(options.meta) : "";
        }
        return `${timestamp} ${level} ${message} ${meta}`;
      }
    }),
    //new (Winston.transports.File)({
    //  filename: "somefile.log"
    //})
  ],
});

if (process.env.NODE_ENV == "production") {
  // https://www.npmjs.com/package/winston-mail
  logger.add(Winston.transports.Mail, {
    level: "error",
    host: Config.get("smtp-host"),
    port: Config.get("smtp-port"),
    from: Config.get("mail-robot"),
    to: Config.get("mail-support"),
    subject: "Application Failed",
  });
}

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

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      logger.error(port + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(port + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  logger.info("Listening on port " + port);
}

/*process.on('uncaughtException', function (err) {
console.error('uncaughtException:', err.message)
console.error(err.stack)
process.exit(1)})*/
