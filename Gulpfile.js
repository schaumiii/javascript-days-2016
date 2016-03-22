var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var chokidar = require('chokidar');
var chalk = require('chalk');
var del = require('del');
var path = require('path');
var bundle = require('gulp-bundle-assets');
var run = require('run-sequence');
var http = require('http');
var serveStatic = require('serve-static');
var send = require('send');

var $$ = gulpLoadPlugins({});

var paths = {};

paths.dir = {
  dist: 'dist',
  css: 'dist/styles',
  vendor: 'bower_components'
};

paths.files = {
  html: './*.html',
  images: './*.png',
  js: 'src/*.js',
  css: paths.dir.css + '/*.css',
  fonts: paths.dir.vendor + '/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}'
};

function chokidarWatch(glob, fn) {
  var watcher = chokidar.watch(glob);
  watcher.on('ready', function() {
    watcher.on('all', function(){
      fn.apply(this, Array.prototype.slice.call(arguments));
    });
  });
}

gulp.task('clean', function() {
  return del([
    paths.dir.dist + '/**/*'
  ]);
});

gulp.task('connect', function() {
  $$.connect.server(
    {
      root: [paths.dir.dist],
      port: 3000,
      livereload: true,
      middleware:  function() {
        return [
          serveStatic(paths.dir.dist, {index: ['index.html']})
        ];
      }
    }
  );
});

gulp.task('html', function () {
  return gulp.src(paths.files.html)
    .pipe($$.connect.reload());
});

gulp.task('build-html', function () {
  return gulp.src(paths.files.html)
    .pipe($$.rename(function(filePath) {
      filePath.dirname = path.basename(filePath.dirname);
      return filePath;
    }))
    .pipe(gulp.dest(paths.dir.dist));
});

gulp.task('build-assets', function () {
  return gulp.src(paths.files.images)
    .pipe($$.rename(function(filePath) {
      filePath.dirname = path.basename(filePath.dirname);
      return filePath;
    }))
    .pipe(gulp.dest(paths.dir.dist + '/images'));
});

gulp.task('build-fonts', function() {
  return gulp.src(paths.files.fonts)
    .pipe($$.rename(function(filePath) {
      filePath.dirname = path.basename(filePath.dirname);
      return filePath;
    }))
    .pipe(gulp.dest(paths.dir.dist + '/fonts'))
});

gulp.task('watch', function () {
  chokidarWatch(paths.files.html, function() {
    run('build-html', 'html');
  });

  chokidarWatch(paths.files.js, function() {
    run('build-js', 'html');
  });
});

gulp.task('build-js', function() {
  return gulp.src(paths.files.js)
    .pipe($$.sourcemaps.init())
    .pipe($$.concat('bundle.js'))
    .pipe($$.sourcemaps.write())
    .pipe(gulp.dest(paths.dir.dist));
});

gulp.task('build-vendor-js', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(gulp.dest(paths.dir.dist));
});


gulp.task('build', function(done) {
  run(['build-js', 'build-vendor-js', 'build-fonts', 'build-html', 'build-assets'], done);
});

gulp.task('serve', function(done) {
  run('clean', 'build', ['connect', 'watch'], done);
});