// DEFAULTS ========================================================================================
let exitOnError = false;
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || "./shared/config";

// IMPORTS =========================================================================================
let ChildProcess = require("child_process");
let Gulp = require("gulp");
let gulpUtil = require("gulp-util");
let runSequence = require("run-sequence");
let jshintStylish = require("jshint-stylish");
let gulpJshint = require("gulp-jshint");
let gulpCached = require("gulp-cached");
let gulpSourcemaps = require("gulp-sourcemaps");
let gulpLess = require("gulp-less");
let gulpConcat = require("gulp-concat");
let gulpRename = require("gulp-rename");
var gulpUglify = require("gulp-uglify");
let gulp6to5 = require("gulp-6to5");
let gulpPlumber = require("gulp-plumber");
let vinylSource = require("vinyl-source-stream");
let vinylBuffer = require("vinyl-buffer");

//let gulpIgnore = require("gulp-ignore");
//let stripDebug = require("gulp-strip-debug");
//let uglify = require("gulp-uglify");
function gulpTo5(opts) {
  return gulp6to5(Object.assign({
    experimental: true
  }, opts));
}

// CONFIG ==========================================================================================
let libraries = [
  "classnames",
  "node-uuid",
  "util-inspect",
  "paqmind.data-lens",
  "immutable",
  "object.assign",
  "lodash.isobject",
  "lodash.debounce",
  "lodash.throttle",
  "axios",
  "joi",
  "react",
  "react/addons",
  "react/lib/ReactLink",
  "react-bootstrap",
  "react-validation-mixin",
  "react-router",
  "react-document-title",
  "reflux",
];

function interleaveWith(array, prefix) {
  return array.reduce((memo, val) => {
    return memo.concat([prefix]).concat([val]);
  }, []);
}

// BACKEND TASKS ===================================================================================
Gulp.task("backend:lint", function() {
  return Gulp.src(["./backend/**/*.js"])
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
//    .pipe(cached("backend:lint"))
    .pipe(gulpJshint())
    .pipe(gulpJshint.reporter(jshintStylish));
});

Gulp.task("backend:nodemon", function() {
  let nodemon = ChildProcess.spawn("npm", ["run", "nodemon"]);
  nodemon.stdout.pipe(process.stdout);
  nodemon.stderr.pipe(process.stderr);
});

// FRONTEND TASKS ==================================================================================
Gulp.task("frontend:move-css", function() {
  return Gulp.src(["./frontend/styles/**/*.css"])
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
    .pipe(Gulp.dest("./static/styles"));
});

Gulp.task("frontend:compile-less", function() {
  return Gulp.src(["./frontend/styles/theme.less", "./frontend/styles/http-errors.less"])
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
    .pipe(gulpLess())
    .pipe(Gulp.dest("./static/styles"));
});

Gulp.task("frontend:dist-styles", [
  "frontend:move-css",
  "frontend:compile-less"
]);

Gulp.task("frontend:lint", function() {
  return Gulp.src(["./frontend/**/*.js"])
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
//    .pipe(cached("lint-react"))
    .pipe(gulpJshint())
    .pipe(gulpJshint.reporter(jshintStylish));
});

Gulp.task("frontend:dist-scripts", function() {
  return Gulp.src(["./frontend/scripts/*.js"])
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
    .pipe(gulpConcat("scripts.js"))
    .pipe(gulpUglify())
    .pipe(Gulp.dest("./static/scripts"));
});

Gulp.task("frontend:dist-images", function() {
  return Gulp.src(["./images/**/*"])
    .pipe(Gulp.dest("./static/images"));
});

Gulp.task("frontend:bundle-vendors", function() {
  // $ browserify -d -r react -r reflux [-r ...] -o ./static/scripts/vendors.js
  let args = ["-d"]
    .concat(interleaveWith(libraries, "-r"))
    .concat(["-o", "./static/scripts/vendors.js"]);

  let bundler = ChildProcess.spawn("browserify", args);
  bundler.stdout.pipe(process.stdout);
  bundler.stderr.pipe(process.stderr);
  bundler.on("exit", function(code) {
    if (exitOnError && code) {
      process.exit(code);
    }
  });
});

Gulp.task("frontend:bundle-app", function() {
  // $ browserify -d -x react -x reflux [-x ...] ./frontend/app/app.js -o ./static/scripts/app.js
  let args = ["-d"]
    .concat(interleaveWith(libraries, "-x"))
    .concat(["./frontend/app/app.js"])
    .concat(["-o", "./static/scripts/app.js"]);

  let bundler = ChildProcess.spawn("browserify", args);
  bundler.stdout.pipe(process.stdout);
  bundler.stderr.pipe(process.stderr);
  bundler.on("exit", function(code) {
    if (exitOnError && code) {
      process.exit(code);
    }
  });
});

Gulp.task("frontend:watchify", function() {
  // $ watchify -v -d -x react -x reflux [-x ...] ./frontend/app/app.js -o ./static/scripts/app.js
  let args = ["-v", "-d"]
    .concat(interleaveWith(libraries, "-x"))
    .concat(["./frontend/app/app.js"])
    .concat(["-o", "./static/scripts/app.js"]);

  let watcher = ChildProcess.spawn("watchify", args);
  watcher.stdout.pipe(process.stdout);
  watcher.stderr.pipe(process.stderr);
});

// TASK DEPENDENCIES ===============================================================================
Gulp.task("frontend:dist", [
  "frontend:bundle-app",
  "frontend:dist-scripts",
  "frontend:dist-images",
  "frontend:dist-styles",
]);

Gulp.task("frontend:watch", function() {
  Gulp.watch("./frontend/scripts/**/*.js", ["frontend:dist-scripts"]);
  Gulp.watch("./frontend/images/**/*", ["frontend:dist-images"]);
  Gulp.watch("./frontend/styles/**/*.less", ["frontend:dist-styles"]);
});

// GENERAL TASKS ===================================================================================
Gulp.task("default", function() {
  return runSequence(
    ["backend:nodemon", "frontend:dist"],
    ["frontend:watch", "frontend:watchify"]
  );
});

Gulp.task("devel", function() {
  return runSequence(
    ["frontend:bundle-vendors", "frontend:dist"],
    "default"
  );
});

// TODO: Gulp.task("lint", ["shared:lint", "backend:lint", "frontend:lint"]);
Gulp.task("dist", function() {
  exitOnError = true;
  return runSequence(
    ["frontend:bundle-vendors", "frontend:dist"]
  );
});
