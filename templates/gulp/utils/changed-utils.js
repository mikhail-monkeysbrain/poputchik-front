'use strict'
const fs = require('fs')
const gutil = require('gulp-util')

function fsOperationFailed (stream, sourceFile, err) {
  if (err) {
    if (err.code !== 'ENOENT') {
      stream.emit('error', new gutil.PluginError('gulp-changed', err, {
        fileName: sourceFile.path
      }))
    }

    stream.push(sourceFile)
  }

  return err
}

function compMinifed (stream, cb, sourceFile, targetPath) {
  fs.stat(targetPath, function (err, targetStat) {
    if (!fsOperationFailed(stream, sourceFile, err)) {
      if (sourceFile.stat.size == targetStat.size || sourceFile.stat.mtime > targetStat.mtime) {
        stream.push(sourceFile)
      }
    }

    cb()
  })
}

module.exports.compMinifed = compMinifed
