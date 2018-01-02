"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var imagemin = require("gulp-imagemin");
var run = require("run-sequence");
var del = require("del");
var uglify = require("gulp-uglify");
var server = require("browser-sync").create();

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]})/*,
      mqpacker({
       sort: true
       })*/
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.reload({stream: true}));
});

 gulp.task("top_style", function() {
   gulp.src("sass/top/*.scss")
   .pipe(plumber())
   .pipe(sass())
   .pipe(postcss([
     autoprefixer({browsers: [
       "last 2 version",
       "last 2 Chrome versions",
       "last 2 Firefox versions",
       "last 2 Opera versions",
       "last 2 Edge versions"
     ]})/*,
     mqpacker({
       sort: true
     })*/
   ]))
   .pipe(gulp.dest("build/css"))
   .pipe(minify())
   .pipe(gulp.dest("build/css"))
   .pipe(server.reload({stream: true}));
 });

gulp.task("copy_css", function() {
  gulp.src("css/*.css")
    .pipe(plumber())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]})/*,
      mqpacker({
        sort: true
      })*/
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(gulp.dest("build/css"))
    .pipe(server.reload({stream: true}));
});

gulp.task("scripts", function() {
  return gulp.src("js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
});

gulp.task("symbols", function() {
  return gulp.src("build/img/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("build/img"));
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("serve", function() {
  server.init({
    server: "build"
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("js/**/*.js", ["scripts"]);
  gulp.watch("build/js/**/*.js").on("change", server.reload);
  gulp.watch("*.html", ["copy_html"]);
  gulp.watch("build/*.html").on("change", server.reload);
});

gulp.task("copy_html", function() {
  return gulp.src("*.html")
    .pipe(gulp.dest("build/"));
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
    "documents/**",
    "images/**",
    "*.txt",
    "*.xml",
    "*.html",
    "*.php"
  ], {
    base: "."
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "copy_css",
    "style",
    "top_style",
    "images",
    "symbols",
    "scripts",
    fn
  );
});
