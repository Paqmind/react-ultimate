"use strict";

var gulp = require("gulp");
var less = require('gulp-less');
//var concat = require("gulp-concat");
//var gulpIgnore = require("gulp-ignore");
//var stripDebug = require("gulp-strip-debug");
//var uglify = require("gulp-uglify");
//var react = require("gulp-react");
//var browserify = require("gulp-browserify");
//var nunjucks = require("gulp-nunjucks");

//gulp.task("dist-css", function() {
//    return gulp.src(['src/**/*.css'])
//      .pipe(gulp.dest('dist'));
//});

//gulp.task("build-label", function () {
//    return gulp.src("src/components/Label.jsx")
//      .pipe(react())
//      .pipe(gulp.dest('build'));
//});

//gulp.task("build-js", function () {
//    return gulp.src("src/**/*.js")
//      .pipe(gulpIgnore.exclude(/~.*\.js$/))
//      .pipe(gulp.dest("build"));
//});

//gulp.task("build-jsx", function () {
//    return gulp.src("src/**/*.jsx")
//      .pipe(gulpIgnore.exclude(/~.*\.jsx$/))
//      .pipe(react({harmony: true}))
//      .pipe(gulp.dest("build"));
//});

//gulp.watch("src/**/*.css", ["dist-css"]);
//gulp.task("watch", function() {
//  gulp.watch("src/**/*.jsx", ["dist-js"]);
//  gulp.watch("src/**/*.js", ["dist-js"]);
//});

//gulp.task("dist-js", ["build-js", "build-jsx"], function() {
//    return gulp.src(["build/**/*.js"])
//      .pipe(browserify()) // debug: !gulp.env.production TODO wtf??
//      //.pipe(concat('theme.js'))
//      //.pipe(stripDebug())
//      //.pipe(uglify())
//      .pipe(gulp.dest("dist"));
//});

//gulp.task("precompile-nunjucks", function () {
//  return gulp.src("express-app/templates/*.html")
//    .pipe(nunjucks())
//    .pipe(concat("templates.js"))
//    .pipe(gulp.dest("express-app/templates"));
//});

gulp.task("compile-less", function() {
  return gulp.src(["assets/styles/src/theme.less"])
    .pipe(less())
    .pipe(gulp.dest("assets/styles/dist"));
});

gulp.task("watch", function() {
  gulp.watch("assets/styles/src/**/*", ["compile-less"]);
});

gulp.task("default", ["watch", "compile-less"]);
