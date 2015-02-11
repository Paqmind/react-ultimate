// IMPORTS
let fs = require("fs");
let path = require("path");
let http = require("http");
let util = require("util");
let cp = require("child_process");
let config = require("config");
let express = require("express");
let io = require("socket.io");
let ss = require("socket.io-stream");
let favicon = require("serve-favicon");
let morgan = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let nunjucks = require("nunjucks");
let markdown = require("nunjucks-markdown");
let marked = require("marked");
let winston = require("winston");
let _ = require("winston-mail");
let moment = require("moment");
let routes = require("./routes/index");

// APPS & SERVERS ----------------------------------------------------------------------------------
let app = express();

// Configs
app.set("etag", config.get("use-etag"));

// Middlewares
app.use(bodyParser.json());                        // parse application/json
app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded

//app.use(morgan("dev")); TODO

/*app.use(cookieParser());*/
let port = process.env.PORT || "3000";
let server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
//var socketEngine = io(server);

// SOCKET-IO ---------------------------------------------------------------------------------------
//let exec  = cp.exec,
//let spawn = cp.spawn;

/*socketEngine.sockets.on("connection", function(socket) {
  console.log("[]-> connection");
  var logFile = path.join(config.get("project-dir"), "log-osx.log");
  ss(socket).on("enter", function(stream, data) {
    var top = spawn("top", ["-l 0"]);
    top.stderr.on("data", function(data) {
      console.log("ps stderr: " + data);
    });
    console.log("[]-> enter:");
    console.log(`[]-> piping ${logFile}`);
//    top.stdout.pipe(stream);
//    console.log("[]-> enter:", path.join(config.get("project-dir"), "log-osx.log"));
    fs.createReadStream(logFile).pipe(stream);
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
app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "html");

let nunjucksEnv = nunjucks.configure("backend/templates", {
  autoescape: true,
  express: app
});

nunjucksEnv.lazyRender = function(name) {
  return nunjucks.render.bind(nunjucks, name);
};

markdown.register(nunjucksEnv, {
//  renderer: new marked.Renderer(),
//  breaks: false,
//  pedantic: false,
//  smartLists: true,
  smartypants: true
});

// ROUTES ==========================================================================================
routes.static = express.static("static", {etag: config.get("use-etag")});

//app.use(favicon(__dirname + "/favicon.ico"));
app.use("/static", routes.static);
app.use("/api", routes.api);
app.use("/", routes.app);

app.use(function(req, res) {
   return res.status(404).render("errors/404.html");
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
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

winston.addColors(customColors);

let logger = new (winston.Logger)({
  colors: customColors,
  levels: customLevels,
  transports: [
    new (winston.transports.Console)({
      level: process.env.NODE_ENV == "development" ? "info" : "warn",
      colorize: true,
      timestamp: function() {
        return moment();
      },
      formatter: function(options) {
        let timestamp = options.timestamp().format("YYYY-MM-DD hh:mm:ss");
        let level = winston.config.colorize(options.level, options.level.toUpperCase());
        let message = options.message;
        let meta;
        if (options.meta instanceof Error) {
          meta = "\n  " + options.meta.stack;
        } else {
          meta = Object.keys(options.meta).length ? util.inspect(options.meta) : "";
        }
        return `${timestamp} ${level} ${message} ${meta}`;
      }
    }),
    //new (winston.transports.File)({
    //  filename: "somefile.log"
    //})
  ],
});

if (process.env.NODE_ENV == "production") {
  // https://www.npmjs.com/package/winston-mail
  logger.add(winston.transports.Mail, {
    level: "error",
    host: config.get("smtp-host"),
    port: config.get("smtp-port"),
    from: config.get("mail-robot"),
    to: config.get("mail-support"),
    subject: "Application Failed",
  });
}

/*
// all environments
app.set('title', 'Application Title');

// development only
if (app.get('env') == "development") {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('mongodb_uri', 'mongo://localhost/dev');
  mongo.connect('development',logger); // mongodb initialization
}

// production only
if (app.get('env') == "production") {
  app.use(express.errorHandler());
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
