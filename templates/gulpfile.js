// Node modules
// const gulp = require('gulp')
const wave = require('./gulp/core/gulp-wave')
const autoprefixer = require('autoprefixer')
const nano = require('cssnano')
const imagemin = require('gulp-imagemin')
const concat = require('gulp-concat')
const postcss = require('gulp-postcss')
const uglify = require('gulp-uglify')
const watch = require('gulp-watch')
const rename = require('gulp-rename')
const newer = require('gulp-newer')
const changed = require('gulp-changed')
const sourcemaps = require('gulp-sourcemaps')
const fs = require('fs')
const path = require('path')
const babel = require('gulp-babel')

// Config
const options = require('../gulp-config')
const cssExt = options.cssExtension
const cssNodeModule = require(options.cssNodeModule)

options.jsInitList.forEach(function (path) {
  options.jsMainList.push('!' + path)
  options.jsLibsList.push('!' + path)
})

wave.task('dev:' + cssExt, function () {
  return wave.src(options.sourcePathStyles + '/styles.' + cssExt)
    .pipe(sourcemaps.init())
    .pipe(cssNodeModule({
      'include css': true
    }))
    .pipe(postcss([
      autoprefixer({
        browsers: options.browsers
      })
    ]))
    .pipe(sourcemaps.write(''))
    .pipe(wave.dest(options.destinationPathStyles))
})

wave.task('release:' + cssExt, function () {
  return wave.src(options.sourcePathStyles + '/styles.' + cssExt)
    .pipe(cssNodeModule({
      'include css': true
    }))
    .pipe(postcss([
      autoprefixer({
        browsers: options.browsers
      }),
      nano({zindex: false})
    ]))
    .pipe(rename(function (path) {
      path.basename += '.min'
    }))
    .pipe(wave.dest(options.destinationPathStyles))
})

wave.task('dev:js:init', function () {
  const jsInitList = options.jsInitList
  jsInitList.push('gulp/socket.io-*.js')
  fs.writeFileSync('gulp/socket.io.cfg.js', ['var port = ', options.port, ';'].join(''))
  jsInitList.push('gulp/socket.io.cfg.js')
  jsInitList.push('gulp/socket.io.app.js')

  return wave.src(jsInitList, {base: options.sourcePathBase})
    .pipe(sourcemaps.init())
    .pipe(babel({
      'presets': [
        ['env', {
          'targets': {
            'browsers': options.browsers
          }
        }]
      ]
    }))
    .pipe(concat('init.js', {newLine: '\n;'}))
    .pipe(sourcemaps.write(''))
    .pipe(wave.dest(options.destinationPathScripts))
})

wave.task('release:js:init', function () {
  return wave.src(options.jsInitList)
    .pipe(babel({
      'presets': [
        ['env', {
          'targets': {
            'browsers': options.browsers
          }
        }]
      ]
    }))
    .pipe(concat('init.min.js', {newLine: '\n;'}))
    .pipe(uglify({
      mangle: true,
      compress: {
        drop_console: true
      }
    }))
    .pipe(wave.dest(options.destinationPathScripts))
})

wave.task('dev:js:main', function () {
  return wave.src(options.jsMainList, {base: options.sourcePathBase})
    .pipe(sourcemaps.init())
    .pipe(babel({
      'presets': [
        ['env', {
          'targets': {
            'browsers': options.browsers
          }
        }]
      ]
    }))
    .pipe(concat('scripts.js', {newLine: '\n;'}))
    .pipe(sourcemaps.write(''))
    .pipe(wave.dest(options.destinationPathScripts))
})

wave.task('release:js:main', function () {
  return wave.src(options.jsMainList)
    .pipe(babel({
      'presets': [
        ['env', {
          'targets': {
            'browsers': options.browsers,
            'uglify': true
          }
        }]
      ]
    }))
    .pipe(concat('scripts.min.js', {newLine: '\n;'}))
    .pipe(uglify({
      mangle: true,
      compress: {
        drop_console: true
      }
    }))
    .pipe(wave.dest(options.destinationPathScripts))
})

wave.task('dev:js:libs', function () {
  return wave.src(options.jsLibsList, {base: options.sourcePathBase})
    .pipe(sourcemaps.init())
    .pipe(concat('libs.js', {newLine: '\n;'}))
    .pipe(sourcemaps.write())
    .pipe(wave.dest(options.destinationPathScripts))
})

wave.task('release:js:libs', function () {
  return wave.src(options.jsLibsList)
    .pipe(concat('libs.min.js', {newLine: '\n;'}))
    .pipe(uglify({
      mangle: true,
      compress: {
        drop_console: true
      }
    }))
    .pipe(wave.dest(options.destinationPathScripts))
})

wave.task('findport', function (done) {
  require('freeport')(function (err, port) {
    if (err) throw err
    options.port = port
    done()
  })
})

wave.task('watch', ['findport'], function () {
  const io = require('socket.io')(options.port, {'transports': ['websocket']})
  console.log('socket.io run on port', options.port)

  wave.watch([
    options.sourcePathStyles + '/**/*.{' + cssExt + ', css}',
    options.sourcePathFonts + '/**/*.{' + cssExt + ', css}'
  ], function (event) {
    wave.start('dev:' + cssExt, function (err) {
      io.emit('update', cssExt)
    })
  })

  wave.watch(options.jsInitList, function () {
    wave.start('dev:js:init')
  })
  wave.watch(options.jsMainList, function () {
    wave.start('dev:js:main')
  })
  wave.watch(options.jsLibsList, function () {
    wave.start('dev:js:libs')
  })
  wave.watch(options.sourcePathImages + '/**/*' + options.imageExtensions, ['images'])
})

wave.task('images', function () {
  return wave.src(options.sourcePathImages + '/**/*' + options.imageExtensions)
    .pipe(wave.ifFlag('DEV', newer(options.destinationPathImages)))
    .pipe(wave.ifFlag('RELEASE', changed(options.destinationPathImages, {hasChanged: require('./gulp/utils/changed-utils.js').compMinifed})))
    .pipe(wave.ifFlag('RELEASE', imagemin({
      progressive: false,
      svgoPlugins: [{removeViewBox: false}]
    })))
    .pipe(wave.dest(options.destinationPathImages))
})

wave.addWaveDep('js:linter')
wave.addWaveDep('dev:sprites', 'images')
wave.addWaveDep('dev:' + cssExt, 'images')
wave.addWaveDep('release:' + cssExt, 'images')
wave.addWaveDep('dev:js:init', 'findport')

wave.task('::default', {flags: 'DEV'}, ['dev:' + cssExt, 'dev:js:init', 'dev:js:main', 'dev:js:libs', 'images', 'watch'])
wave.task('::release', {flags: 'RELEASE'}, ['release:' + cssExt, 'release:js:init', 'release:js:main', 'release:js:libs', 'images'])
wave.task('default', ['::default'])
wave.task('release', ['::release'])

wave.loadModules('gulp/modules', options)
