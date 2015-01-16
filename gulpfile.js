/**
 * http://io.pellucid.com/blog/tips-and-tricks-for-faster-front-end-builds
 *
*/
let faker = require("faker");
let gulp = require("gulp");
let gulpUtil = require("gulp-util");
let browserify = require("browserify");
let watchify = require("watchify");
let runSequence = require("run-sequence");
let jshintStylish = require("jshint-stylish");
let gulpJshint = require("gulp-jshint");
let gulpCached = require("gulp-cached");
let gulpLess = require("gulp-less");
let gulpConcat = require("gulp-concat");
let gulpRename = require("gulp-rename");
let gulp6to5 = require("gulp-6to5");
let source = require("vinyl-source-stream");

let prod = gulpUtil.env.prod; // .pipe(prod ? stream(uglify()) : gutil.noop())

//var gulpIgnore = require("gulp-ignore");
//var stripDebug = require("gulp-strip-debug");
//var uglify = require("gulp-uglify");

// TODO: fix and update this
gulp.task("compile-less", function() {
  return gulp.src(["./src/styles/theme.less"])
    .pipe(gulpLess())
    .pipe(gulpRename("bundle.css"))
    .pipe(gulp.dest("./static/styles"));
});

gulp.task("lint-react", function() {
  return gulp.src(["./src/app_react/**/*.js"])
//    .pipe(cached("lint-react"))
    .pipe(gulpJshint())
    .pipe(gulpJshint.reporter(jshintStylish));
});

gulp.task("lint-express", function() {
  return gulp.src(["./src/app_express/**/*.js"])
//    .pipe(cached("lint-express"))
    .pipe(gulpJshint())
    .pipe(gulpJshint.reporter(jshintStylish));
});

gulp.task("build-react", function() {
  return gulp.src(["./src/app_react/**/*.js?(x)"])
    .pipe(gulp6to5())
    .pipe(gulpRename(function (path) {
      if (path.extname == ".jsx")
        path.extname = ".js"
    }))
    .pipe(gulp.dest("./build/app_react"));
});

gulp.task("dist-react", ["build-react"], function() {
  return browserify("./build/app_react/app.js", {debug: true}) // debug: !prod
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./static/scripts"));
});

gulp.task("watch", function() {
  //gulp.watch("./src/styles/**/*.less", "compile-less");
  gulp.watch("./src/app_react/**/*.js?(x)", ["dist-react"]);
});

gulp.task("dist", ["compile-less", "dist-react"]);

//gulp.task("lint", ["lint-express", "lint-react"]);

gulp.task("dev", function () {
  return runSequence(
    "dist",
    "watch"
  );
});

gulp.task("prod", function () {
  return runSequence(
    //"lint",
    "dist"
  );
});
