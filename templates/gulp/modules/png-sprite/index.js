const config = require('../../../../gulp-config')

module.exports = function (wave, options) {
  if (config.pngSprites) {
    startSprites(wave, options)
  }
}

function startSprites (wave, options) {
  const spritesmith = require('gulp.spritesmith')
  const fs = require('fs')
  const async = require('async')
  // const newer = require('gulp-newer')
  const through = require('through2')
  const handlebars = require('handlebars')
  const layouts = require('handlebars-layouts')
  const cssExt = config.cssExtension
  const cssFolder = cssExt

  options.sourcePathPngTemplates = options.sourcePathPngTemplates || 'gulp/modules/png-sprite/templates'
  options.sourcePathPngSprites = options.sourcePathPngSprites || 'src/sprites/png'
  options.destinationPathPngSprites = options.destinationPathPngSprites || 'src/images'

  wave.task('sprite:png', function (done) {
    fs.readdir(options.sourcePathPngSprites, function (err, files) {
      if (err) throw err
      async.map(files,
        function (file, cb) {
          fs.stat(options.sourcePathPngSprites + '/' + file, function (err, stats) {
            if (err) throw err
            if (stats.isDirectory()) {
              makeSprite(
                wave,
                file,
                options.sourcePathPngSprites + '/' + file + '/**/*.png',
                cb
              )
            } else {
              cb(err, '')
            }
          })
        }, function (err, results) {
          if (err) throw err
          let changed = false
          wave.src(options.sourcePathStyles + '/sprites/png-sprites/*.' + cssExt)
            // .pipe(newer(options.sourcePathStyles + '/sprites/png-sprite.' + cssExt))
            .pipe(through.obj(function (file, encoding, endFn) {
              changed = true
              endFn(null, file)
            }))
            .on('finish', function (err) {
              if (err) throw err
              if (changed) {
                fs.writeFile(options.sourcePathStyles + '/sprites/png-sprite.' + cssExt, results.filter(function (item) { return !!item }).join('\n'), function () {
                  done()
                })
              } else {
                done()
              }
            })
        }
      )
    })
  })

  wave.task('watch:sprite:png', function () {
    wave.watch(options.sourcePathPngSprites + '/**/*.png', function () {
      setTimeout(function () { wave.start('sprite:png') }, 200)
    })
  })
  wave.addDep('::default', ['sprite:png', 'watch:sprite:png'])
  wave.addDep('::release', 'sprite:png')
  wave.addWaveDep('images', 'sprite:png')
  wave.addWaveDep('dev:sprites', 'sprite:png')

  function makeSprite (wave, suffix, srcPath, cb) {
    let spriteData
    const spriteImgName = [suffix, '.png'].join('')
    const spriteCssName = [suffix, '.' + cssExt].join('')

    handlebars.registerHelper(layouts(handlebars))
    handlebars.registerPartial('png-sprite', fs.readFileSync(options.sourcePathPngTemplates + '/' + cssFolder + '/png-sprite.hbs', 'utf8'))
    spriteData = wave.src(srcPath)
      // .pipe(newer(options.destinationPathPngSprites + '/png-sprites/'+spriteImgName))
      .pipe(
        spritesmith(
          {
            imgName: spriteImgName,
            cssName: spriteCssName,
            Algorithms: 'binary-tree',
            padding: 8,
            cssTemplate: options.sourcePathPngTemplates + '/' + cssFolder + '/png-sprite-classes.hbs'
          }
        )
      )
    async.parallel({
      img: function (callback) {
        spriteData.img
          // .pipe(newer(options.destinationPathPngSprites + '/png-sprites/'+spriteImgName))
          .pipe(through.obj(function (file, encoding, endFn) {
            endFn(null, file)
          }))
          .pipe(wave.dest(options.destinationPathPngSprites + '/png-sprites/'))
          .on('end', function (err) {
            callback(err, true)
          })
      },
      css: function (callback) {
        spriteData.css
          // .pipe(newer(options.sourcePathStyles + '/sprites/png-sprites/'+spriteCssName))
          .pipe(through.obj(function (file, encoding, endFn) {
            endFn(null, file)
          }))
          .pipe(wave.dest(options.sourcePathStyles + '/sprites/png-sprites/'))
          .on('end', function (err) {
            callback(err, suffix)
          })
      }
    },
    function (err, results) {
      cb(err, ['@import "png-sprites/', results.css, '.', cssExt, '";'].join(''))
    })
  }
}
