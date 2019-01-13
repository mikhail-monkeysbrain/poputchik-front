const config = require('../../../../gulp-config')

module.exports = function (wave, options) {
  if (config.jsLinter) {
    runLinter(wave, options)
  }
}

function runLinter (wave, options) {
  const standard = require('gulp-standard')

  wave.task('js:linter', function () {
    return wave.src(config.jsLintList, {base: config.sourcePathBase})
      .pipe(standard())
      .pipe(standard.reporter('default', {
        breakOnError: true,
        showFilePath: true,
        showRuleNames: true
      }))
  })

  wave.task('watch:js:linter', function () {
    wave.watch(options.jsLintList, function () {
      wave.start('js:linter')
    })
  })
  wave.addDep('::default', ['js:linter', 'watch:js:linter'])
  wave.addDep('::release', 'js:linter')
}
