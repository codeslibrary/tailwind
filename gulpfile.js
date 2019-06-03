// Default Plug
const { src, dest, parallel, watch, series } = require('gulp');
// Gulp
const gulp = require('gulp');
// Minify HTML files
const htmlmin = require('gulp-htmlmin');
// Old browser compability
const autoprefixer = require('gulp-autoprefixer');
//Minify CSS files
const cleanCSS = require('gulp-clean-css');
//Remove Unused CSS
const purgecss = require('gulp-purgecss');
//Rename Files
const rename = require("gulp-rename");
// Merge all js files into one
const concat = require('gulp-concat');
// Minified js
const uglify = require('gulp-uglify');
//Minifies Images
const imagemin = require('gulp-imagemin');
// Postcss 
const postcss = require('gulp-postcss');
// Tailwindcss
const tailwindcss = require("tailwindcss");

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || [];
  }
}



function css() {
    return gulp.src('./css/style.css')
    .pipe(
      postcss([tailwindcss("./tailwind.js"), require("autoprefixer")])
    )
    .pipe(
      purgecss({
        content: ['./build/*.html'],
        extractors: [
          {
            extractor: TailwindExtractor,
            extensions: ["html", "js"]
          }
        ]
      }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename("style.min.css"))
      .pipe(gulp.dest('./build/assets/css'));
  };

 

  function html() {
    return src('./*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(dest('build'))
  };

function scripts() {
    return gulp.src('./js/*.js')
      .pipe(concat('scripts.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./build/assets/js'));
  };

function imgmin(){
   return gulp.src('./images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/assets/img'))
};

function live() {
    gulp.watch('./*.html',series(html,css));
    gulp.watch('./css/style.css',css);
    gulp.watch('./js/*.js',scripts);
  };

exports.imgmin = imgmin
exports.scripts = scripts
exports.live = live
exports.css = css
exports.html = html   
exports.default = parallel(html,css,scripts,live);





