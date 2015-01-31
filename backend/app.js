/* global debug */

// IMPORTS
let fs = require("fs");
let path = require("path");
let http = require("http");
let cp = require("child_process");
let express = require("express");
let io = require("socket.io");
let ss = require("socket.io-stream");
let favicon = require("serve-favicon");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let conf = require("config");

let router = require("./router");
let templater = require("./templater");

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

let tplEnv = templater(app);

let _ = router(app);


/*
app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mongo.connect('development',logger); // mongodb initialization
});

app.configure('production', function () {
  app.use(express.errorHandler());
  mongo.connect('production',logger); // mongodb initialization
});*/
