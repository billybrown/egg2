var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var exec = require('child_process').exec;
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var postcss     = require('gulp-postcss');
var reporter    = require('postcss-reporter');
var syntax_scss = require('postcss-scss');
var stylelint   = require('stylelint');
var autoprefixer = require('autoprefixer');

gulp.task('scss-lint', function(){
  // Stylelint config rules
  var stylelintConfig = {
    "rules": {
      "block-no-empty": true,
      "color-no-invalid-hex": true,
      "declaration-colon-space-after": "always",
      "declaration-colon-space-before": "never",
      "function-url-quotes": "always",
      "media-feature-colon-space-after": "always",
      "media-feature-colon-space-before": "never",
      "max-empty-lines": 5,
      "number-no-trailing-zeros": true,
      "declaration-block-no-duplicate-properties": true,
      "declaration-block-trailing-semicolon": "always"
    }
  }

  var processors = [
    stylelint(stylelintConfig),
    reporter({
      clearMessages: true,
      throwError: true
    })
  ];

  return gulp.src(
      ['scss/**/*.scss',
      // Ignore linting vendor assets
      '!scss/vendors/**/*.scss']
    )
    .pipe(postcss(processors, {syntax: syntax_scss}));
});


// do all the good stuff ot js (concat, uglify)
gulp.task('css-compile', function(){

  return gulp.src(['scss/app.scss'])
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(concat('app.min.css'))
    .pipe(postcss([ autoprefixer({
      browsers: [
      '> 1%',
      'last 2 versions',
      'Firefox ESR',
      'Opera 12.1',
      'ie >= 9',
      'Firefox >= 23',
      'Chrome >= 22',
      'Safari >= 4',
      'iOS >= 5.1',
      'Android >= 4.1'
      ]
    }) ]))
    .pipe(cleanCSS({compatibility: 'ie9'}))
    .pipe(gulp.dest('css'));
});


// do all the good stuff ot js (concat, uglify)
gulp.task('css-vendor', function(){
  return gulp.src(['css/vendor/slabtext.css'])
    .pipe(concat('plugins.min.css'))
    .pipe(cleanCSS({compatibility: 'ie9'}))
    .pipe(gulp.dest('css'));
});


// minify custom js
gulp.task('js', function () {
  gulp.src('js/app.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('js'));
});


// do all the good stuff ot js (concat, uglify)
gulp.task('js-vendor', function(){
  return gulp.src(['js/vendor/jquery.waypoints.min.js', 'js/vendor/imagesloaded.pkgd.min.js', 'js/vendor/walkway.min.js', 'js/vendor/jquery.fitvids.js', 'js/vendor/jquery.smoothscroll.min.js', 'js/vendor/jquery.sticky.js'])
    .pipe(concat('plugins.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});


// do the patternlab stuff
gulp.task('plab', function (cb) {
  exec('php ./patternlab/core/console --generate', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});


// tasks to run when watching
gulp.task('default', function() {
  gulp.watch(['scss/**/*.scss'], ['scss-lint','css-compile']);
  gulp.watch(['patternlab/source/**/**'], ['plab']);
  gulp.watch(['js/app.js'], ['js']);
});

gulp.task('css',
  [
    'scss-lint',
    'css-compile'
  ]);

gulp.task('build',
  [
    'scss-lint',
    'css-compile',
    'css-vendor',
    'js',
    'js-vendor',
    'plab'
  ]);

// just incase someone tries to run 'gulp watch' instead of just 'gulp'
gulp.task('watch', ['default']);
