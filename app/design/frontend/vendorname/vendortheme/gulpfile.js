var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    cssmin = require('gulp-cssmin'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plumber = require('gulp-plumber');


var $ = gulpLoadPlugins();

const HOST_URL = 'http://jordanmnufacturing.vlazarev.office.webdevs.us';


var config = {

    minifyCss: true,
    uglifyJS: true,
    IS_DEV: true

};

var vendorName = 'Wdevs';
var themeName = 'wdevsmanufacturing';
var webPath = 'web/';
var rootPath = '../../../../../pub/static/frontend/' + vendorName + '/' + themeName + '/en_US/';


// Sass
gulp.task('css', function () {
    var stream = gulp.src(webPath + 'scss/styles.scss')
        .pipe($.if(config.IS_DEV, $.sourcemaps.init()))
        .pipe(plumber())
        .pipe(sass({errLogToConsole: true}))
        .on('error', function (err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe($.if(!config.IS_DEV, $.cssmin()))
        .pipe($.if(config.IS_DEV, $.sourcemaps.write('.')))
        .pipe(gulp.dest(webPath + 'css'))
        .pipe(gulp.dest(rootPath + 'css'));

    if (config.minifyCss === true) {
        stream.pipe(minifycss({keepSpecialComments: '0'}));
    }

    stream.pipe(browserSync.stream());

    return stream.pipe(notify({message: 'Sass compiled succesfully!'}));
});

// JS
gulp.task('js', function () {
    /* Here you need to append your custom codes placed on js/custom folder */
    var scripts = [
        webPath + 'js/custom/_custom.js',
    ];

    var stream = gulp
        .src(scripts)
        .pipe(concat('script.js'));

    if (config.uglifyJS === true) {
        stream.pipe(uglify());
    }

    stream.pipe(gulp.dest(webPath + 'js'));
    stream.pipe(gulp.dest(rootPath + 'js'));
    stream.pipe(browserSync.stream())

    return stream.pipe(notify({message: 'Successfully compiled JavaScript'}));
});

// Images
gulp.task('images', function () {
    return gulp
        .src(webPath + 'images/dist/**/*')
        .pipe(imagemin({progressive: true, optimizationLevel: 9}))
        .pipe(gulp.dest(webPath + 'images'))
        .pipe(gulp.dest(rootPath + 'images'))
        .pipe(browserSync.stream())
        .pipe(notify({message: 'Successfully processed image'}));
});

// Default task
gulp.task('build', [], function () {
    gulp.start('css', 'js', 'images');
});

// Watch
gulp.task('watch', function () {

    // Watch files

    gulp.watch('**/**/*.scss', ['css']);

    // Watch .js files
    gulp.watch(webPath + 'js/**/*.js', ['js']);

    // Watch image files
    gulp.watch(webPath + 'images/**/*', ['images']);

});

function browserSyncInit(browser) {
    browser = browser || 'default';

    var options = {
        port: 3000,
        proxy: {
            target: HOST_URL
        },
        ghostMode: {
            clicks: false,
            location: false,
            forms: false,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-kp',
        notify: true,
        reloadDelay: 0, //1000,
        online: true,
        browser: browser
    };

    browserSync.instance = browserSync.init(options);
}

gulp.task('serve', ['watch'], browserSyncInit());

