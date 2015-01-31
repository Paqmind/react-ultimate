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
let gulpSourcemaps = require("gulp-sourcemaps");
let gulpLess = require("gulp-less");
let gulpConcat = require("gulp-concat");
let gulpRename = require("gulp-rename");
let gulp6to5 = require("gulp-6to5");
let vinylSource = require("vinyl-source-stream");
let vinylBuffer = require("vinyl-buffer");

//var gulpIgnore = require("gulp-ignore");
//var stripDebug = require("gulp-strip-debug");
//var uglify = require("gulp-uglify");

// TODO: fix and update this
gulp.task("frontend:compile-less", function() {
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
let vendorBundler = browserify(browserifyOpts).require(externals);
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

let bundleVendors = function() {
  gulpUtil.log("Bundle vendors");
  return vendorBundler.bundle()
    .on("error", gulpUtil.log.bind(gulpUtil, "Browserify Error")) // TODO: or just `gulpUtil.log`?
    .pipe(vinylSource("vendors.js"))
    .pipe(vinylBuffer())
    .pipe(gulpSourcemaps.init({loadMaps: true}))
    .pipe(gulpSourcemaps.write()) // TODO: or "./"?
    .pipe(gulp.dest("./static/scripts"));
};
vendorBundler.on("error", gulpUtil.log.bind(gulpUtil, "Browserify Error")); // TODO: or just `gulpUtil.log`?

gulp.task("frontend:dist-vendors", bundleVendors);

gulp.task("frontend:dist-app", ["frontend:build-app"], bundleApp);

gulp.task("watch"/*, ["serve"]*/, function() {
  gulp.watch("./frontend/**/*.js", ["frontend:build-app"]);
});

gulp.task("dist", ["frontend:compile-less", "frontend:dist-vendors", "frontend:dist-app"]);

//gulp.task("lint", ["backend:lint", "frontend:lint"]);

gulp.task("dev", function() {
  process.env.NODE_ENV = "development";
  return runSequence(["dist", "watch"]);
});

gulp.task("prod", function() {
  process.env.NODE_ENV = "production";
  return runSequence(["dist"]); // TODO: "lint"
});
