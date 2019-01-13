'use strict'

app.components.Multiloader = (function () {
  /**
   * @param minQueue
   * @constructor
   */
  const MultiLoader = function (minQueue) {
    this._queue = []
    this._callback = null
    this._minQueue = minQueue || 0
    this._lastCreatedStack = 0

    for (let i = 0; i < this._minQueue; i++) {
      this._queue.push(false)
    }
  }

  /**
   * Добавляем callback, который выполнится, когда все отложенные события будут завершены
   * @param callback
   * @param [scope]
   */
  MultiLoader.prototype.addCallback = function (callback, scope) {
    this._callback = callback
    this._scope = scope || this
  }

  /**
   * Создаеит и возвращает функцию, которая при выполнении отметит стек как выполненный
   * @returns {Function}
   */
  MultiLoader.prototype.createStack = function () {
    const that = this
    let myNum = that._lastCreatedStack++

    if (myNum > this._queue.length - 1) {
      that._queue.push(false)
    }

    return function () {
      that._checkStack(myNum)
    }
  }

  /**
   * Проверка стека за определенным номером
   * @param stackNum
   * @private
   */
  MultiLoader.prototype._checkStack = function (stackNum) {
    this._queue[stackNum] = true

    if (_.every(this._queue)) {
      if (typeof this._callback === 'function') {
        this._callback.apply(this._scope)
      }
    }
  }

  return MultiLoader
})()
