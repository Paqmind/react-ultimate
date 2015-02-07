/**
 * http://io.pellucid.com/blog/tips-and-tricks-for-faster-front-end-builds
 *
*/
process.env.NODE_ENV = process.env.NODE_ENV || "development";

let faker = require("faker");
let gulp = require("gulp");
let gulpUtil = require("gulp-util");
let browserify = require("browserify");
let watchify = require("watchify");
let runSequence = require("run-sequence");
let jshintStylish = require("jshint-stylish");
let gulpJshint = require("gulp-jshint");
let gulpCached = require("gulp-cached");
let gulpSourcemaps = require("gulp-sourcemaps");
let gulpLess = require("gulp-less");
let gulpConcat = require("gulp-concat");
let gulpRename = require("gulp-rename");
var gulpUglify = require('gulp-uglify');
let gulp6to5 = require("gulp-6to5");
let vinylSource = require("vinyl-source-stream");
let vinylBuffer = require("vinyl-buffer");

//var gulpIgnore = require("gulp-ignore");
//var stripDebug = require("gulp-strip-debug");
//var uglify = require("gulp-uglify");

// TODO: fix and update this
gulp.task("frontend:dist-styles", function() {
  return gulp.src(["./frontend/styles/theme.less"])
    .pipe(gulpLess().on("error", function (error) {console.log(error); }))
    .pipe(gulpRename("bundle.css"))
    .pipe(gulp.dest("./static/styles"));
});

gulp.task("frontend:lint", function() {
  return gulp.src(["./frontend/**/*.js"])
//    .pipe(cached("lint-react"))
    .pipe(gulpJshint())
    .pipe(gulpJshint.reporter(jshintStylish));
});

gulp.task("backend:lint", function() {
  return gulp.src(["./backend/**/*.js"])
//    .pipe(cached("backend:lint"))
    .pipe(gulpJshint())
    .pipe(gulpJshint.reporter(jshintStylish));
});

gulp.task("frontend:build-app", function() {
  return gulp.src(["./frontend/**/*.js"])
    .pipe(gulpSourcemaps.init())
    .pipe(gulp6to5())
    .pipe(gulpSourcemaps.write())
    .pipe(gulp.dest("./build/frontend"));
});

let externals = [
  "react", "react-router", "react-document-title", "lodash",
];

let browserifyOpts = Object.assign(watchify.args, {debug: true});

let appBundler = browserify("./build/frontend/app/app.js", browserifyOpts);
appBundler.external(externals);
appBundler = (process.env.NODE_ENV == "development") ? watchify(appBundler) : appBundler;
let bundleApp = function() {
  gulpUtil.log("Bundle app");
  return appBundler.bundle()
    .pipe(vinylSource("bundle.js"))
    .pipe(vinylBuffer())
    .pipe(gulpSourcemaps.init({loadMaps: true}))
    .pipe(gulpSourcemaps.write()) // TODO: or "./"?
    .pipe(gulp.dest("./static/scripts"));
};
appBundler.on("error", gulpUtil.log.bind(gulpUtil, "Browserify Error")); // TODO: or just `gulpUtil.log`?
appBundler.on("update", bundleApp);

let vendorBundler = browserify(browserifyOpts).require(externals);
let bundleVendors = function() {
  gulpUtil.log("Bundle vendors");
  return vendorBundler.bundle()
    .pipe(vinylSource("vendors.js"))
    .pipe(vinylBuffer())
    .pipe(gulpSourcemaps.init({loadMaps: true}))
    .pipe(gulpSourcemaps.write()) // TODO: or "./"?
    .pipe(gulp.dest("./static/scripts"));
};
vendorBundler.on("error", gulpUtil.log.bind(gulpUtil, "Browserify Error")); // TODO: or just `gulpUtil.log`?

gulp.task("frontend:dist-vendors", bundleVendors);

gulp.task("frontend:dist-scripts", function() {
  return gulp.src(["./frontend/scripts/*.js"])
    .pipe(gulpConcat('scripts.js'))
    .pipe(gulpUglify())
    .pipe(gulp.dest("./static/scripts"));
});

gulp.task("frontend:dist-app", ["frontend:build-app"], bundleApp);

gulp.task("watch"/*, ["serve"]*/, function() {
  gulp.watch("./frontend/app/**/*.js", ["frontend:build-app"]);
  gulp.watch("./frontend/scripts/**/*.js", ["frontend:dist-scripts"]);
  gulp.watch("./frontend/styles/**/*.less", ["frontend:dist-styles"]);
});

gulp.task("dist", ["frontend:dist-styles", "frontend:dist-scripts", "frontend:dist-vendors", "frontend:dist-app"]);

//gulp.task("lint", ["backend:lint", "frontend:lint"]);

gulp.task("default", function() {
  if (process.env.NODE_ENV == "development") {
    return runSequence(["dist", "watch"]);
  } else {
    return runSequence(["dist"]); // TODO: "lint"
  }
});
