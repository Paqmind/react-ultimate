// ENV =============================================================================================
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || "./shared/config";

// IMPORTS =========================================================================================
let Path = require("path");
let Glob = require("glob");
let ChildProcess = require("child_process");
let Mkdirp = require("mkdirp");
let Config = require("config");
let RunSequence = require("run-sequence");
let Gulp = require("gulp");
let GulpJshint = require("gulp-jshint");
let JshintStylish = require("jshint-stylish");
let GulpCached = require("gulp-cached");
let GulpSourcemaps = require("gulp-sourcemaps");
let GulpLess = require("gulp-less");
let GulpPlumber = require("gulp-plumber");
let frontendVendors = require("./package.json").frontendVendors;

// OPTIONS =========================================================================================
let exitOnError = false;

// HELPERS =========================================================================================
function interleaveWith(array, flag) {
  return array.reduce((memo, val) => {
    return memo.concat([flag, val]);
  }, []);
}

// TASKS ===========================================================================================
Gulp.task("dist-styles", function () {
  return Gulp.src(["./frontend/styles/theme.less"])
    .pipe(GulpPlumber({errorHandler: !exitOnError}))
    .pipe(GulpLess())
    .pipe(Gulp.dest("./static/styles"));
});

//Gulp.task("lint", function () {
//  return Gulp.src(["./frontend/**/*.js"])
//    .pipe(GulpPlumber({errorHandler: !exitOnError}))
//    .pipe(cached("lint-react"))
//    .pipe(GulpJshint())
//    .pipe(GulpJshint.reporter(JshintStylish));
//});

Gulp.task("dist-images", function () {
  return Gulp.src(["./images/**/*"])
    .pipe(Gulp.dest("./static/images"));
});

Gulp.task("dist-vendors", function () {
  // $ browserify -d -r react [-r ...] -o ./static/scripts/vendors.js
  let args = ["-d", "--delay", "0"]
    .concat(interleaveWith(frontendVendors, "-r"))
    .concat(["-o", "./static/scripts/vendors.js"]);

  let bundler = ChildProcess.spawn("browserify", args);
  bundler.stdout.pipe(process.stdout);
  bundler.stderr.pipe(process.stderr);
  bundler.on("exit", function (code) {
    if (exitOnError && code) {
      process.exit(code);
    }
  });
});

Gulp.task("dist-scripts", function () {
  // $ browserify -d -x react [-x ...] ./frontend/scripts/app.js -o ./static/scripts/app.js
  let args = ["-d", "--delay", "0"]
    .concat(interleaveWith(frontendVendors, "-x"))
    .concat(["./frontend/scripts/app.js"])
    .concat(["-o", "./static/scripts/app.js"]);

  let bundler = ChildProcess.spawn("browserify", args);
  bundler.stdout.pipe(process.stdout);
  bundler.stderr.pipe(process.stderr);
  bundler.on("exit", function (code) {
    if (exitOnError && code) {
      process.exit(code);
    }
  });
});

Gulp.task("watchify", function () {
  // $ watchify -v -d -x react -x reflux [-x ...] ./frontend/scripts/app.js -o ./static/scripts/app.js
  let args = ["-v", "-d", "--delay", "0"]
    .concat(interleaveWith(frontendVendors, "-x"))
    .concat(["./frontend/scripts/app.js"])
    .concat(["-o", "./static/scripts/app.js"]);

  let watcher = ChildProcess.spawn("watchify", args);
  watcher.stdout.pipe(process.stdout);
  watcher.stderr.pipe(process.stderr);
});

Gulp.task("watch-src", function () {
  Gulp.watch("./frontend/images/**/*", ["dist-images"]);
  Gulp.watch("./frontend/styles/**/*.less", ["dist-styles"]);
});

Gulp.task("dist", function () {
  exitOnError = true;
  return RunSequence(
    ["dist-vendors", "dist-scripts", "dist-images", "dist-styles"]
  );
});

Gulp.task("watch", ["watch-src", "watchify"]);

Gulp.task("config:get", function () {
  let argv = require("yargs").argv;
  let value = Config.get(argv.option);
  //if (value === undefined) {
  //  throw Error(`Undefined option ${argv.option}`);
  //} else {
  console.log(value);
  //}
});
