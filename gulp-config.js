/*
* Конфигурационный файл для Gulp
* Все базовые настройки вынесены сюда
* */

'use strict'

const config = {
  cssPreprocessor: 'stylus', // less || sass || stylus
  jadePreprocessor: true,
  pngSprites: true,
  svgSprites: true,
  jsLinter: true,
  browsers: ['last 3 versions'],
  imageExtensions: '.{jpg,jpeg,png,gif,svg}',
  port: 81
}

config.css = cssConfig()
config.cssExtension = config.css.extension
config.cssNodeModule = config.css.nodeModule

// Пути для исходников
config.sourcePathBase = 'src'
config.sourcePathStyles = 'src/' + config.cssExtension
config.sourcePathFonts = 'src/fonts'
config.sourcePathScripts = 'src/js'
config.sourcePathSprites = 'src/' + config.cssExtension + '/sprites'
config.sourcePathImages = 'src/images'

// Пути для генерируемых файлов
config.destinationPathStyles = 'build/css'
config.destinationPathScripts = 'build/js'
config.destinationPathImages = 'build/images'

// Список скриптов и библиотек,
// которые помещаются в начало <body/>
config.jsInitList = [
  'node_modules/jquery/dist/jquery.js',
  'node_modules/lodash/lodash.js',
  'node_modules/backbone/backbone.js',
  config.sourcePathScripts + '/libs/device.*.js',
  config.sourcePathScripts + '/libs/modernizr-*.js',
  config.sourcePathScripts + '/components/Application.js',
  config.sourcePathScripts + '/components/Adaptive.js'
]

// Список js библиотек,
// которые помещаются в конце <body/>
config.jsLibsList = [
  config.sourcePathScripts + '/libs/*.js',
  config.sourcePathScripts + '/libs/**/*.js'
]

// Список скриптов, которые пишем сами
// и которые помещаются в конце <body/>
config.jsMainList = [
  config.sourcePathScripts + '/components/Utils.js',
  config.sourcePathScripts + '/components/*.js',
  config.sourcePathScripts + '/components/**/*.js',
  config.sourcePathScripts + '/core/*.js',
  config.sourcePathScripts + '/core/**/*.js',
  config.sourcePathScripts + '/behaviors/*.js',
  config.sourcePathScripts + '/models/*.js',
  config.sourcePathScripts + '/data/*.js',
  config.sourcePathScripts + '/BView/Default.js',
  config.sourcePathScripts + '/BView/*.js',
  config.sourcePathScripts + '/BView/subView/*.js',
  config.sourcePathScripts + '/Router.js',
  config.sourcePathScripts + '/script.js'
]

// Список скриптов, которые обрабатываются линтером
config.jsLintList = [
  config.sourcePathScripts + '/components/*.js',
  config.sourcePathScripts + '/components/**/*.js',
  config.sourcePathScripts + '/core/*.js',
  config.sourcePathScripts + '/core/**/*.js',
  config.sourcePathScripts + '/behaviors/*.js',
  config.sourcePathScripts + '/models/*.js',
  config.sourcePathScripts + '/data/*.js',
  config.sourcePathScripts + '/BView/*.js',
  config.sourcePathScripts + '/BView/**/*.js',
  config.sourcePathScripts + '/Router.js',
  config.sourcePathScripts + '/script.js'
]

// Динамическая конфигурация CSS препроцессора
function cssConfig () {
  let css = {}
  switch (config.cssPreprocessor) {
    case 'sass':
    case 'scss':
      css.extension = 'scss'
      css.nodeModule = 'gulp-sass'
      css.scss = {}
      break
    case 'stylus':
    case 'styl':
      css.extension = 'styl'
      css.nodeModule = 'gulp-stylus'
      css.styl = {}
      break
    case 'less':
    default:
      css.extension = 'less'
      css.nodeModule = 'gulp-less'
      css.less = {}
      break
  }
  return css
}

module.exports = config
