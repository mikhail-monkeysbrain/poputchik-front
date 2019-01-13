const config = require('../../../../gulp-config')

module.exports = function (wave, options) {
  if (config.svgSprites) {
    startSprites(wave, options)
  }
}

function startSprites (wave, options) {
  const svgSprite = require('gulp-svg-sprite')
  const replace = require('gulp-replace')
  // const newer = require('gulp-newer')
  const through = require('through2')
  const cssExt = config.cssExtension
  const spriteCss = config.css
  let spriteConfig

  options.sourcePathSvgTemplate = options.sourcePathSvgTemplate || 'gulp/modules/svg-sprite'
  options.sourcePathSvgSprites = options.sourcePathSvgSprites || 'src/sprites/svg'
  options.destinationPathSvgSprites = options.destinationPathSvgSprites || 'src/images'
  options.jsLibsList.push('gulp/modules/svg-sprite/assets/js/libs/svg4everybody.js')
  options.jsMainList.push('gulp/modules/svg-sprite/assets/js/script.js')

  switch (cssExt) {
    case 'scss':
      spriteCss.scss.template = options.sourcePathSvgTemplate + '/svg-sprite.scss.mustache'
      spriteCss.scss.dest = '../../src/scss/sprites/svg-sprite.scss'
      break
    case 'styl':
      spriteCss.styl.template = options.sourcePathSvgTemplate + '/svg-sprite.styl.mustache'
      spriteCss.styl.dest = '../../src/styl/sprites/svg-sprite.styl'
      break
    case 'less':
    default:
      spriteCss.less.template = options.sourcePathSvgTemplate + '/svg-sprite.less.mustache'
      spriteCss.less.dest = '../../src/less/sprites/svg-sprite.less'
      break
  }

  spriteConfig = function () {
    return {
      dest: '.',
      shape: {
        spacing: { // Add padding
          padding: 8,
          box: 'content'
        },
        dimension: { // Dimension related options
          maxWidth: 8000, // Max. shape width
          maxHeight: 8000, // Max. shape height
          precision: 2, // Floating point precision
          attributes: false // Width and height attributes on embedded shapes
        },
        transform: false
      },
      mode: {
        css: { // Activate the «css» mode
          bust: false,
          dest: '.',
          prefix: 'icon-',
          sprite: 'sprite.svg',
          render: spriteCss
        },
        symbol: {
          dest: '.',
          sprite: 'symbols.svg',
          example: {
            template: options.sourcePathSvgTemplate + '/symbols.html',
            dest: '../../src/images/symbols-demo.html'
          }
        }
      }
    }
  }

  wave.task('sprite:svg', function (done) {
    let changed = false
    wave.src(options.sourcePathSvgSprites + '/*.svg')
      // .pipe(newer(options.destinationPathSvgSprites + '/sprite.svg'))
      .pipe(through.obj(function (file, encoding, endFn) {
        changed = true
        endFn()
      }))
      .on('finish', function (err) {
        if (err) throw err
        if (changed) {
          wave.src(options.sourcePathSvgSprites + '/*.svg')
            .pipe(replace({
              patterns: [
                {
                  match: /^<svg/,
                  replacement: '<?xml version="1.0" encoding="UTF-8"?><svg'
                }
              ]
            }))
            .pipe(svgSprite(spriteConfig()))
            .pipe(wave.dest(options.destinationPathSvgSprites))
            .on('end', function (err) {
              if (err) throw err
              done()
            })
        } else {
          done()
        }
      })
  })
  wave.task('watch:sprite:svg', function () {
    wave.watch(options.sourcePathSvgSprites + '/*.svg', function () {
      wave.start('sprite:svg')
    })
  })
  wave.addDep('::default', ['sprite:svg', 'watch:sprite:svg'])
  wave.addDep('::release', 'sprite:svg')
  wave.addWaveDep('images', 'sprite:svg')
  wave.addWaveDep('dev:sprites', 'sprite:svg')
  wave.addWaveDep('dev:' + cssExt, 'sprite:svg')
  wave.addWaveDep('release:' + cssExt, 'sprite:svg')
}
