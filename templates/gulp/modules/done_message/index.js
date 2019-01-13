const gutil = require('gulp-util')
const chalk = require('chalk')
const gulp = require('gulp')

module.exports = function (wave, options) {
  gulp.on('stop', function () {
    gutil.log(chalk.green.bold('DONE!'))
  })
}
