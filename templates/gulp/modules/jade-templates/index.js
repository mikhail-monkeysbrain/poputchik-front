const config = require('../../../../gulp-config')

module.exports = function (wave, options) {
  if (config.jadePreprocessor) {
    startJade(wave, options)
  }
}

function startJade (wave, options) {
  const jade = require('gulp-jade')
  const merge = require('merge')
  const mergeRecursive = merge.recursive
  const replace = require('gulp-replace-task')
  const newer = require('gulp-newer')
  const fs = require('fs')
  const path = require('path')
  const defaults = require('lodash.defaults')
  const each = require('lodash.foreach')
  const rename = require('gulp-rename')
  const lodash = require('lodash')

  let patterns = []
  let data

  options.sourcePathJade = options.sourcePathJade || 'src/jade'
  options.sourcePathJadeBody = options.sourcePathJadeBody || 'src/jade'
  options.sourcePathJadePages = options.sourcePathJadePages || 'src/jade/pages'
  options.sourcePathJadeBlocks = options.sourcePathJadeBlocks || 'src/jade/blocks'
  options.sourcePathJadeMixins = options.sourcePathJadeMixins || 'src/jade/mixins'
  options.sourcePathJadeModules = options.sourcePathJadeModules || 'src/jade/modules'
  options.sourcePathJadeTemplates = options.sourcePathJadeTemplates || 'src/jade/templates'
  options.destinationPathJade = options.destinationPathJade || 'pages'
  options.destinationPathJadeBody = options.destinationPathJadeBody || './'
  options.destinationPathScripts = options.destinationPathScripts || 'build/js'
  options.destinationPathStyles = options.destinationPathStyles || 'src/build/css'
  options.destinationPathImages = options.destinationPathImages || 'src/images'
  options.jade = options.jade || {}
  options.jade.PATH_JS = options.jade.PATH_JS || 'templates/' + options.destinationPathScripts
  options.jade.PATH_CSS = options.jade.PATH_CSS || 'templates/' + options.destinationPathStyles
  options.jade.PATH_IMG = options.jade.PATH_IMG || 'templates/' + options.destinationPathImages
  options.CONST = defaults(options.CONST || {}, {})

  wave.task('jade:modules', function (done) {
    fs.readdir(options.sourcePathJadeModules, function (err, files) {
      let text
      let vars
      if (err) throw err
      vars = [
        '- var MODULE = {}'
      ]
      text = [
        'mixin module(name,data)',
        '	- data = data || {}'
      ]
      files = files.filter(function (moduleName) { return moduleName[0] !== '_' })
      if (files) {
        files.forEach(function (fileName) {
          const moduleName = path.basename(fileName, path.extname(fileName))
          const addon = [
              '	if (name=="' + moduleName + '")',
              '		include ' + moduleName,
              '		+'+moduleName + '(data)&attributes(data&&data.attrs||attributes)',
              '			if(block)',
              '				block'
            ].join('\n')
          vars.push('- MODULE.' + (moduleName.toUpperCase()) + ' = "' + moduleName + '"')
          text.push(addon)
        })
      } else {
        text.push('	= ""')
      }
      fs.writeFile(options.sourcePathJadeModules + '/_modules.jade', [vars.join('\n'), text.join('\n')].join('\n'), function (err) {
        if (err) throw err
        done()
      })
    })
  })

  patterns = [
    {
      match: '%=min=%',
      replacement: wave.isFlag('RELEASE') ? '.min' : ''
    },
    {
      match: '%=hash=%',
      replacement: (new Date()).getTime()
    },
    {
      match: '%=PATH_JS=%',
      replacement: options.jade.PATH_JS
    },
    {
      match: '%=PATH_CSS=%',
      replacement: options.jade.PATH_CSS
    },
    {
      match: '%=PATH_IMG=%',
      replacement: options.jade.PATH_IMG
    }
  ]
  each(options.CONST, function (value, key) {
    patterns.push({
      match: '%=' + key + '=%',
      replacement: value
    })
  })
  data = fs.readFileSync(options.sourcePathJade + '/data.json', 'utf8')
  data = mergeRecursive(
    {
      _: lodash,
      CONST: options.CONST,
      FLAG: wave._flags
    },
    JSON.parse(data)
  )
  // data = mergeRecursive(true)

  // Запускать wave.start('jade:modules') внутри таска вроде как нельзя,
  // но это единственный рабочий вариант,
  // при котором галп не выбрасывает ошибки во время сборки на NodeJS v7.5.0.
  // Ошибка связана с тем, что иногда порядок выполнения тасков рандомно меняется.
  // Правильный вариант закомментирован ниже и работает как миннимум на NodeJS v6.9.2
  // wave.task('jade', ['jade:modules'], function (done) {
  wave.task('jade', function (done) {
    wave.start('jade:modules')

    let body
    let pages
    let all

    body = wave.src([options.sourcePathJadeBody + '/*.jade'])
      .pipe(newer(options.destinationPathJadeBody))
      .pipe(jade({pretty: true, locals: data}))
      .pipe(replace({
        patterns: patterns,
        usePrefix: false
      }))
      .pipe(rename(function (path) {
        path.extname = '.php'
      }))
      .pipe(wave.dest(options.destinationPathJadeBody))

    pages = wave.src([options.sourcePathJadePages + '/**/*.jade'])
      .pipe(newer(options.destinationPathJade))
      .pipe(jade({pretty: true, locals: data}))
      .pipe(replace({
        patterns: patterns,
        usePrefix: false
      }))
      .pipe(rename(function (path) {
        path.extname = '.php'
      }))
      .pipe(wave.dest(options.destinationPathJade))

    all = body && pages

    return all
  })

  wave.task('watch:jade', function () {
    wave.watch([
      options.sourcePathJade + '/**/*.json',
      options.sourcePathJade + '/**/*.jade'
    ], ['jade'])
  })

  wave.addDep('::default', ['jade', 'watch:jade'])
  wave.addDep('::release', ['jade'])
}
