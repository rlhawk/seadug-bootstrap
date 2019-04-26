var gulp = require('gulp');
var yargs = require('yargs');
var del = require('del');

// Load all Gulp plugins into one variable
var $ = require('gulp-load-plugins')();

// Get the defined configuration.
config = config();

// Clean CSS files.
gulp.task('clean:css', function() {
  return del([
    config.themeBaseDir + '/css',
  ], { force: true });
});

// Clean JavaScript files.
gulp.task('clean:js', function() {
  return del([
    config.themeBaseDir + '/js/vendor'
  ], { force: true });
});

// Compile CSS files.
gulp.task('sass', gulp.series('clean:css', function() {
  return gulp.src(config.sassSourceFiles)
    .pipe($.sass({
      includePaths: config.sassIncludePaths
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 10']
    }))
    .pipe($.size({ showFiles: true }))
    .pipe(gulp.dest(config.themeBaseDir + '/css'));
}));

// Copy JavaScript files.
gulp.task('js', gulp.series('clean:js', function() {
  return gulp
    .src(config.jsSourceFiles)
    .pipe(gulp.dest(config.themeBaseDir + '/js/vendor'));
}));

// Perform all necessary tasks for a build.
gulp.task('build', gulp.series('sass', 'js'));

// Watch for changes to Sass files.
gulp.task('watch', gulp.series('sass', function() {
  gulp.watch(config.sassSourceFiles, gulp.series('sass'));
}));

// Define configuration.
function config() {
  let config = [];

  config.themeBaseDir = './web/themes/custom/seadug_bootstrap';
  config.sassSourceFiles = [config.themeBaseDir + '/scss/**/*.scss'];

  config.sassIncludePaths = [
    config.themeBaseDir + '/scss',
    './node_modules'
  ];

  config.jsSourceFiles = [
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/popper.js/dist/umd/popper.min.js'
  ];

  return config;
}
