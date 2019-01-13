;(function () {
  const View = app.ns('app.core').View = Backbone.View.extend({
    subView: {},
    constructor: function (options) {
      const self = this
      const newOptions = ['ui', 'gui', 'tpls', 'behaviors', 'subView', 'subViews']
      options = options || {}
      applyOptions.call(self, options, newOptions)
      self.behaviors = []
      self.subView = {}
      self.subViews = []
      normalizeEvents.call(self, options)
      View.__super__.constructor.apply(self, [options])
    },
    _setElement: function () {
      const self = this
      View.__super__._setElement.apply(self, arguments)
      initUIs.call(self)
      initTpls.call(self)
      clearBehaviors.call(self)
      initBehaviors.call(self)
      clearSubViews.call(self)
      initSubViews.call(self)
    },
    remove: function () {
      const self = this
      self.off()
      app.off(null, null, self)
      clearUIs.call(self)
      clearTpls.call(self)
      clearBehaviors.call(self)
      clearSubViews.call(self)
      View.__super__.remove.apply(self, arguments)
    }
  })

  function applyOptions (options, applyList) {
    const self = this
    _.each(_.pick(_.defaults(options, self), applyList), function (option, optionName) {
      self[optionName] = option
      self['_' + optionName] = _.clone(option)
    })
  }

  function initUIs () {
    const self = this
    self.ui = _.reduce(self._ui, function (ui, selector, key) {
      ui[key] = self.$(selector)
      return ui
    }, {})
    self.gui = _.reduce(self._gui, function (gui, selector, key) {
      gui[key] = $(selector)
      return gui
    }, {})
  }

  function clearUIs () {
    const self = this
    _.invoke(self.ui, 'off')
    self.ui = {}
    _.invoke(self.gui, 'off')
    self.gui = {}
  }

  function normalizeEvents (options) {
    this.events = normalizeKeys.call(this, this.events)
    options.events = normalizeKeys.call(this, options.events)
  }

  function normalizeKeys (hash) {
    const self = this
    return _.reduce(hash, function (memo, val, key) {
      const normalizedKey = normalizeUIString.call(self, key)
      memo[normalizedKey] = val
      return memo
    }, {})
  }

  function normalizeUIString (uiString) {
    const self = this
    const ui = self._ui
    return uiString.replace(/@ui\.[a-zA-Z-_$0-9]*/g, function (r) {
      return ui[r.slice(4)]
    })
    // .replace(/@gui\.[a-zA-Z-_$0-9]*/g, function(r) {
    //    return gui[r.slice(5)];
    // });
  }

  function initTpls () {
    const self = this
    self.tpls = _.reduce(self._tpls, function (tpls, selector, key) {
      const $tpl = $(['[id="', selector, '"]'].join(''))
      let tpl
      if ($tpl.length) {
        tpl = $tpl.html()
      } else {
        tpl = selector
      }
      tpls[key] = _.template(tpl)
      return tpls
    }, {})
  }

  function clearTpls () {
    const self = this
    self.tpls = {}
  }

  function initBehaviors () {
    const self = this
    self.behaviors = []
    _.each(self._behaviors, function (Behavior) {
      let params = {}
      let el
      if (_.isObject(Behavior)) {
        params = Behavior.params
        el = Behavior.el
        Behavior = Behavior.behavior
      }
      if ((Behavior = app.ns('behaviors', app)[Behavior])) {
        let behavior = new Behavior({
          el: el || self.$el,
          params: params
        })
        self.behaviors.push(behavior)
        behavior.render()
      }
    })
  }

  function clearBehaviors () {
    const self = this
    if (self.behaviors) {
      _.each(self.behaviors, function (item, key) {
        app.off(null, null, item)
        item.remove()
        delete (self.behaviors[key])
      })
      self.behaviors = []
    }
  }

  function initSubViews () {
    const self = this
    _.each(self._subViews, function (subView) {
      let params = normalizeSubViewParams(subView)
      let el = params.el
      params.SubView = params.subView
      if (el) {
        el = self.$(el)
        _.each(el, function (item) {
          let _subView = new params.SubView(_.defaults({el: item}, params.options))
          self.subViews.push(_subView)
          _subView.render()
        })
      } else {
        let _subView = new params.SubView(params.options)
        self.subViews.push(_subView)
        _subView.render()
      }
    })
    _.each(self._subView, function (subView, key) {
      let params = normalizeSubViewParams(subView)
      params.SubView = params.subView
      let _subView = new params.SubView(params.options)
      self.subView[key] = _subView
      _subView.render()
    })
  }

  function normalizeSubViewParams (subView) {
    let options = {}
    let el = false
    if (_.isObject(subView)) {
      options = subView.options || {}
      el = subView.el || el
      subView = subView.subView
    }
    if (_.isString(subView)) {
      subView = app.subViews[subView]
    }
    return {
      subView: subView,
      options: options,
      el: el
    }
  }

  function clearSubViews () {
    const self = this
    _.each(self.subView, function (item, key) {
      app.off(null, null, item)
      item.remove()
      delete (self.subView[key])
    })
    self.subView = {}
    _.each(self.subViews, function (item, key) {
      app.off(null, null, item)
      item.remove()
      delete (self.subViews[key])
    })
    self.subViews = []
  }
}())
