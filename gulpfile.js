// IMPORTS =========================================================================================
import "shared/env";
import "shared/shims";
import Path from "path";
import ChildProcess from "child_process";
import Config from "config";
import runSequence from "run-sequence";
import Gulp from "gulp";
import GulpCached from "gulp-cached";
import GulpLess from "gulp-less";
import GulpPlumber from "gulp-plumber";
import {frontendVendors} from "./package.json";

// OPTIONS =========================================================================================
let exitOnError = false;

// TASKS ===========================================================================================
Gulp.task("dist-styles", function () {
  return Gulp.src(["./frontend/styles/theme.less"])
    .pipe(GulpPlumber({errorHandler: !exitOnError}))
    .pipe(GulpLess())
    .pipe(Gulp.dest("./public/styles"));
});

Gulp.task("dist-images", function () {
  return Gulp.src(["./frontend/images/**/*"])
    .pipe(Gulp.dest("./public/images"));
});

Gulp.task("watch-assets", function () {
  Gulp.watch("frontend/images/**/*", ["dist-images"]);
  Gulp.watch("frontend/styles/**/*.less", ["dist-styles"]);
});

Gulp.task("watch", ["watch-assets"]);

Gulp.task("dist", ["dist-images", "dist-styles"]);

Gulp.task("dev", function (cb) {
  return runSequence(
    "dist", "watch", cb
  );
});

Gulp.task("prod", function (cb) {
  exitOnError = true;
  return runSequence(
    "dist", /*"minify-assets", "cachebust",*/ cb
  );
});

Gulp.task("config:get", function () {
  let argv = require("yargs").argv;
  let value = Config.get(argv.option);
  //if (value === undefined) {
  //  throw Error(`Undefined option ${argv.option}`);
  //} else {
  console.log(value);
  //}
});
