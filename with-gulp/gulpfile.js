var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var watchify = require("watchify");
var gutil = require("gulp-util");

var paths = {
    html: ["src/*.html"],
    css: ["src/*.css"]
};

gulp.task("copy-css", function () {
    return gulp.src(paths.css)
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-html", function () {
    return gulp.src(paths.html)
        .pipe(gulp.dest("dist"));
});

const watchedBrowserify = watchify(browserify({
    basedir: ".",
    debug: true,
    entries: ["src/index.ts"],
    cache: {},
    packageCache: {}
}).plugin(tsify)
    .transform("babelify", {
        presets: ["es2015"], extensions: [".ts"]
    }));

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
}

gulp.task("default", ["copy-html", "copy-css"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);