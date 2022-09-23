//  var gulp = require('gulp');
//  var sass = require('gulp-sass');
//  //  const sass = require('gulp-sass')(require('sass'));

//  gulp.task('sass', function() {
//      return gulp.src('./scss/styles.scss')
//          .pipe(sass()) // Using gulp-sass
//          .pipe(gulp.dest('./css/styles.css'))
//  });

const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
    return src('scss/styles.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(dest('css', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
    browsersync.init({
        proxy: 'http://localhost:61511/'
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch('*.html', browsersyncReload);
    watch('scss/**/*.scss', series(scssTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
    scssTask,
    browsersyncServe,
    watchTask
);