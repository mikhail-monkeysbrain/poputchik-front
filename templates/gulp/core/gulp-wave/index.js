const gulp = require('gulp')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const gulpif = require('gulp-if')
const fs = require('fs')
let Wave
let defaultAddDepOptions

Wave = function (ops) {
  const self = this
  ops = ops || {}
  self.isFirstWave = true
  self.waveDeps = []
  self.watchList = []
  self._flags = ops.flags || {}
  self._utils = ops.utils || {}
  self._utils.errorLog = self._utils._errorLog || utils.errorLog
  this.gulp = gulp
  gulp.once('stop', function () {
    self._makeWaveDeps()
    self._startWatching()
  })
}
defaultAddDepOptions = {
  direct: false
}
Wave.prototype.getTask = function (taskName) {
  return gulp.hasTask(taskName) && gulp.tasks[taskName]
}

Wave.prototype.addDep = function (taskName, depTaskName, opts) {
  const self = this
  let task

  opts = opts || defaultAddDepOptions
  if (Array.isArray(depTaskName)) {
    depTaskName.forEach(function (depTaskName) {
      self._addDep(taskName, depTaskName, opts)
    })
    return
  } else {
    self._addDep(taskName, depTaskName, opts)
  }
  if ((task = this.getTask(taskName))) {
    if (opts.once) {
      this.waveDeps.push([taskName, depTaskName])
    }
  }
}

Wave.prototype.addWaveDep = function (taskName, depTaskName, opts) {
  opts = opts || {}
  opts.once = true
  this.addDep(taskName, depTaskName, opts)
}

Wave.prototype._makeWaveDeps = function () {
  const self = this
  const depsMap = {}
  const depsReMap = {}
  self.waveDeps.forEach(function (dep) {
    const task = dep[0]
    const reqTask = dep[1]

    self.removeDep.apply(self, dep)
    if (gulp.seq.indexOf(task) > -1 && gulp.seq.indexOf(reqTask) > -1) {
      if (depsMap[reqTask]) {
        depsMap[reqTask].push(task)
      } else {
        depsMap[reqTask] = [task]
      }
      if (depsReMap[task]) {
        depsReMap[task].push(reqTask)
      } else {
        depsReMap[task] = [reqTask]
      }
    }
  })
  self.depsMap = depsMap
  gulp.on('starting', function (e) {
    const nextTasks = []
    e.tasks.forEach(function (taskName) {
      if (depsMap[taskName]) {
        depsMap[taskName].forEach(function (nextTaskName) {
          self._addDep.call(self, nextTaskName, taskName)
          nextTasks.push(nextTaskName)
        })
      }
    })
    if (nextTasks.length) {
      gulp.once('start', function () {
        nextTasks.forEach(function (nextTaskName) {
          const nextTask = gulp.tasks[nextTaskName]
          if (nextTask.running) {
            nextTask.needrestart = true
          }
        })
        self.start.apply(self, nextTasks)
      })
    }
  })
  gulp.on('task_stop', function (e) {
    const task = gulp.tasks[e.task]
    const depsTasks = depsReMap[e.task]

    if (depsTasks) {
      depsTasks.forEach(self.removeDep.bind(self, e.task))
    }
    if (task.needreatart) {
      task.needreatart = false
      self.start(e.task)
    }
  })
}

Wave.prototype.removeDep = function (taskName, depTaskName) {
  const self = this
  let index
  let task
  let deps
  if ((task = self.getTask(taskName))) {
    deps = task.dep
    index = deps.indexOf(depTaskName)
    deps.splice(index, 1)
  }
}

Wave.prototype._addDep = function (taskName, depTaskName, opts) {
  if ((task = this.getTask(taskName))) {
    deps = task.dep
    if (!(depTaskName in deps)) {
      deps.push(depTaskName)
    }
  }
};

['start', 'add', 'task', 'run', 'dest', 'hasTask'].forEach(function (method) {
  Wave.prototype[method] = function () {
    return gulp[method].apply(gulp, arguments)
  }
})

Wave.prototype.task = function () {
  const self = this
  const task = arguments[0]
  let opts
  let flags
  const args = []
  const hasOpts = toString.call(arguments[1]) === '[object Object]'
  opts = hasOpts ? arguments[1] : {}
  flags = Array.isArray.call(opts.flags) ? opts.flags : (toString.call(opts.flags) === '[object String]' ? [opts.flags] : [])
  args.push(task)
  args.push.apply(args, [].slice.call(arguments, hasOpts ? 2 : 1))
  if (hasOpts) {
    gulp.once('start', function (e) {
      if (gulp.seq.indexOf(task) >= 0) {
        flags.forEach(self.setFlag.bind(self))
      }
    })
  }
  return gulp.task.apply(gulp, args)
}

Wave.prototype.src = function () {
  const self = this
  return gulp.src.apply(gulp, arguments)
    .pipe(plumber(self._utils.errorLog))
}

Wave.prototype.watch = function (glob, opt, fn, wfn) {
  const self = this
  if (self.isFirstWave) {
    this.watchList.push([glob, opt, fn, wfn])
  } else {
    self._startWatch(glob, opt, fn, wfn)
  }
}
Wave.prototype._startWatching = function () {
  const self = this
  this.watchList.forEach(function (args) {
    self._startWatch.apply(self, args)
  })
  self.isFirstWave = false
}
Wave.prototype._startWatch = function (glob, opt, fn, wfn) {
  const vfs = gulp.watch(glob, opt, fn)
  if (wfn && typeof wfn === 'function') {
    wfn(vfs, glob, opt, fn)
  }
}

Wave.prototype.loadModules = function (dirPath, options) {
  const self = this
  options = options || {}
  dirPath = dirPath + '/'
  fs.readdirSync(dirPath).forEach(function (path) {
    let stats
    const fullDirPath = dirPath + path + '/'
    const indexPath = fullDirPath + 'index.js'
    stats = fs.statSync(fullDirPath)
    if (stats.isDirectory()) {
      stats = fs.statSync(indexPath)
      if (stats.isFile()) {
        require(process.cwd() + '/' + indexPath)(self, options)
      }
    }
  })
}

Wave.prototype.setFlag = function (flag) {
  this._flags[flag] = true
}

Wave.prototype.unsetFlag = function (flag) {
  this._flags[flag] = false
}

Wave.prototype.isFlag = function (flag, value) {
  return !!this._flags[flag]
}

Wave.prototype.ifFlag = function (flag, trueOp, falseOp) {
  return gulpif(this.isFlag(flag), trueOp, falseOp)
}

const gulpStartMethod = gulp.start
gulp.start = function () {
  let i
  let arg
  let names = []
  let args
  args = Array.prototype.slice.call(arguments, 0)
  for (i = 0; i < args.length; i++) {
    arg = args[i]
    if (typeof arg === 'string') {
      names.push(arg)
    } else if (Array.isArray(arg)) {
      names = names.concat(arg) // FRAGILE: ASSUME: it's an array of strings
    }
  }
  gulp.emit('starting', {tasks: names})
  const res = gulpStartMethod.apply(gulp, args)
  gulp.emit('started', {tasks: names})
  return res
}

const utils = {
  errorLog: function (error) {
    notify.onError({
      title: 'Error',
      message: 'in <%= error.plugin %>.\n<%= error.message %>',
      sound: true
    })(error)
    this.emit('end')
  }
}

module.exports = new Wave()
