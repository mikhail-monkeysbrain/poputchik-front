'use strict'

app.ns('app.core').Behavior = Backbone.View.extend({

  target: '[data-behavior]',

  initialize: function (config) {
    const self = this
    self.params = config.params || self.defaults
  },

  render: function () {
    app.core.Behavior.__super__.render.apply(this, arguments)
    const self = this
    let $targets = self.$(self.target)

    self.$targets = $targets
    self.initAll($targets)
  },

  remove: function () {
    this.stopListening()
    return this
  },

  initAll: function ($targets) {
    const self = this
    _.map($targets, _.flow($, _.bind(self.initEach, self)))
  },

  initEach: function () {
  },

  getParams: function (data) {
    const self = this
    let result = {}
    let datas = self.datas

    _.each(datas, function (dataName, paramName) {
      const value = data[dataName]
      if (value) result[paramName] = value
    })
    return result
  },

  getOption: function (key, params, validator) {
    const self = this
    let ops = self.params
    let dfs = self.defaults
    let candidats = [params[key], ops[key], dfs[key]]
    let res

    validator = validator || _.negate(_.isUndefined)
    candidats = _.map(candidats, self._getValue)
    res = _.find(candidats, validator)
    return res
  },
  _getValue: function (value) {
    return _.isFunction(value) ? value() : value
  }
})
