/**
 * http://io.pellucid.com/blog/tips-and-tricks-for-faster-front-end-builds
 *
*/
process.env.NODE_ENV = process.env.NODE_ENV || "development";

let ChildProcess = require("child_process");
let gulp = require("gulp");
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
  "lodash.debounce",
  "axios",
  "joi",
  "react",
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

// COMMON TASKS ====================================================================================
gulp.task("common:build", function() {
  return gulp.src(["./common/**/*.js"])
    .pipe(gulpPlumber())
    .pipe(gulpSourcemaps.init())
    .pipe(gulpTo5())
    .pipe(gulpSourcemaps.write())
    .pipe(gulp.dest("./build/common"));
});

// BACKEND TASKS ===================================================================================
gulp.task("backend:lint", function() {
  return gulp.src(["./backend/**/*.js"])
    .pipe(gulpPlumber())
//    .pipe(cached("backend:lint"))
    .pipe(gulpJshint())
    .pipe(gulpJshint.reporter(jshintStylish));
});

gulp.task("backend:nodemon", function() {
  if (process.env.NODE_ENV == "development") {
    let nodemon = ChildProcess.spawn("npm", ["run", "nodemon"]);
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);
  }
});

// FRONTEND TASKS ==================================================================================
gulp.task("frontend:move-css", function() {
  return gulp.src(["./frontend/styles/**/*.css"])
    .pipe(gulpPlumber())
    .pipe(gulp.dest("./static/styles"));
});

gulp.task("frontend:compile-less", function() {
  return gulp.src(["./frontend/styles/theme.less", "./frontend/styles/http-errors.less"])
    .pipe(gulpPlumber())
    .pipe(gulpLess())
    .pipe(gulp.dest("./static/styles"));
});

gulp.task("frontend:dist-styles", [
  "frontend:move-css",
  "frontend:compile-less"
]);

gulp.task("frontend:lint", function() {
  return gulp.src(["./frontend/**/*.js"])
    .pipe(gulpPlumber())
//    .pipe(cached("lint-react"))
    .pipe(gulpJshint())
    .pipe(gulpJshint.reporter(jshintStylish));
});

gulp.task("frontend:build-app", function() {
  return gulp.src(["./frontend/**/*.js"])
    .pipe(gulpPlumber())
    .pipe(gulpSourcemaps.init())
    .pipe(gulpTo5())
    .pipe(gulpSourcemaps.write())
    .pipe(gulp.dest("./build/frontend"));
});

gulp.task("frontend:dist-scripts", function() {
  return gulp.src(["./frontend/scripts/*.js"])
    .pipe(gulpPlumber())
    .pipe(gulpConcat("scripts.js"))
    .pipe(gulpUglify())
    .pipe(gulp.dest("./static/scripts"));
});

gulp.task("frontend:dist-images", function() {
  return gulp.src(["./frontend/images/**/*"])
    .pipe(gulp.dest("./static/images"));
});

gulp.task("frontend:bundle-vendors", function() {
  if (process.env.NODE_ENV == "development") {
    // $ browserify -d -r react -r reflux [-r ...] -o ./static/scripts/vendors.js
    let args = ["-d"]
      .concat(interleaveWith(libraries, "-r"))
      .concat(["-o", "./static/scripts/vendors.js"]);

    let bundler = ChildProcess.spawn("browserify", args);
    bundler.stdout.pipe(process.stdout);
    bundler.stderr.pipe(process.stderr);
  }
});

gulp.task("frontend:bundle-app", function() {
  if (process.env.NODE_ENV == "development") {
    // $ browserify -d -x react -x reflux [-x ...] ./build/frontend/app/app.js -o ./static/scripts/app.js
    let args = ["-d"]
      .concat(interleaveWith(libraries, "-x"))
      .concat(["./build/frontend/app/app.js"])
      .concat(["-o", "./static/scripts/app.js"]);

    let bundler = ChildProcess.spawn("browserify", args);
    bundler.stdout.pipe(process.stdout);
    bundler.stderr.pipe(process.stderr);
  }
});

gulp.task("frontend:watchify", function() {
  if (process.env.NODE_ENV == "development") {
    // $ watchify -v -d -x react -x reflux [-x ...] ./build/frontend/app/app.js -o ./static/scripts/app.js
    let args = ["-v", "-d"]
      .concat(interleaveWith(libraries, "-x"))
      .concat(["./build/frontend/app/app.js"])
      .concat(["-o", "./static/scripts/app.js"]);

    let watcher = ChildProcess.spawn("watchify", args);
    watcher.stdout.pipe(process.stdout);
    watcher.stderr.pipe(process.stderr);
  }
});

// TASK DEPENDENCIES ===============================================================================
gulp.task("common:watch", function() {
  gulp.watch("./common/**/*.js", ["common:build"]);
});

gulp.task("frontend:build", [
  "common:build",
  "frontend:build-app"
]);

gulp.task("frontend:dist", [
  "frontend:build",
  "frontend:bundle-app",
  "frontend:dist-scripts",
  "frontend:dist-images",
  "frontend:dist-styles",
]);

gulp.task("frontend:watch", function() {
  gulp.watch("./frontend/app/**/*.js", ["frontend:build-app"]);
  gulp.watch("./frontend/scripts/**/*.js", ["frontend:dist-scripts"]);
  gulp.watch("./frontend/images/**/*", ["frontend:dist-images"]);
  gulp.watch("./frontend/styles/**/*.less", ["frontend:dist-styles"]);
});

// GENERAL TASKS ===================================================================================
// TODO: gulp.task("lint", ["common:lint", "backend:lint", "frontend:lint"]);

gulp.task("default", function() {
  if (process.env.NODE_ENV == "development") {
    return runSequence(
      ["backend:nodemon", "frontend:dist"],
      ["common:watch", "frontend:watch", "frontend:watchify"]
    );
  } else {
    return runSequence(
      ["frontend:dist"]
    );
  }
});
