/* global debug */

// IMPORTS
let fs = require("fs");
let path = require("path");
let http = require("http");
let cp = require("child_process");
let config = require("config");
let express = require("express");
let io = require("socket.io");
let ss = require("socket.io-stream");
let favicon = require("serve-favicon");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let conf = require("config");
let nunjucks = require("nunjucks");
let markdown = require("nunjucks-markdown");
let marked = require("marked");
let routes = require("./routes/index");

// APPS & SERVERS ----------------------------------------------------------------------------------
let app = express();

// Configs
app.set("etag", conf.get("use-etag"));

// Middlewares
app.use(bodyParser.json());                        // parse application/json
app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded

//app.use(logger("dev")); TODO

/*app.use(cookieParser());*/
var server = http.Server(app);
server.listen(process.env.PORT || 3000);
console.log("Express server listening on port " + server.address().port);
//var socketEngine = io(server);

// SOCKET-IO ---------------------------------------------------------------------------------------
var exec  = cp.exec,
    spawn = cp.spawn;

/*socketEngine.sockets.on("connection", function(socket) {
  console.log("[]-> connection");
  var logFile = path.join(conf.get("project-dir"), "log-osx.log");
  ss(socket).on("enter", function(stream, data) {
    var top = spawn("top", ["-l 0"]);
    top.stderr.on("data", function(data) {
      console.log("ps stderr: " + data);
    });
    console.log("[]-> enter:");
    console.log(`[]-> piping ${logFile}`);
//    top.stdout.pipe(stream);
//    console.log("[]-> enter:", path.join(conf.get("project-dir"), "log-osx.log"));
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
routes.static = express.static("static", {etag: conf.get("use-etag")});

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
    error: (app.get("env") == "development") ? err : {}
  });
});

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


/*process.on('uncaughtException', function (err) {
console.error('uncaughtException:', err.message)
console.error(err.stack)
process.exit(1)})*/
