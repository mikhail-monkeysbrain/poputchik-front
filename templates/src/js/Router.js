'use strict'

/**
 * @class  app.modules.Router
 * @extends  Backbone.Router
 */
app.modules.Router = Backbone.Router.extend({

  _pageCounter: 0,

  routes: {
    '*href': 'baseRout'
  },

  lastPath: false,
  curPath: false,

  baseRout: function () {
    const self = this
    let path = Backbone.history.fragment || './'
    let View = 'NotFound'
    let view

    self.lastPath = self.curPath
    self.curPath = path
    if (!this._pageCounter) {
      const $view = $('[data-view]')
      if ($view.length) {
        if ($.trim($view.data('view')) !== '') {
          View = app.views[$view.data('view')]
          view = new View({el: $view})
          app.GlobalView.show(view)
          console.log('%cТекущая вьюшка = %s', 'color: green', $view.data('view'))
        } else {
          console.log('%c[data-view] не заполнено', 'color: red')
        }
      } else {
        console.log('%c[data-view] не найдено', 'color: red')
      }
    } else {
      // стандартное смена страниц через
      // fadeOut->display preloader->none preloader->fadeIn
      let p1 = $.Deferred()
      let p2 = $.Deferred()
      let p3 = $.when(p1, p2)

      p3.done(function () {
        if (view.html) {
          app.GlobalView.show(view)
        }
      })

      app.once('View.goOutDefaultEnd', function () {
        p1.resolve()
      })
      app.once('View.ajax.complete', function () {
        p2.resolve()
      })

      app.GlobalView.hide()

      $.get(path, {
        _: _.now()
      }, function (data) {
        if (data.jsview) {
          if ($.trim(data.jsview) !== '') {
            view = new app.views[data.jsview]()
            view.setProps(
              data.body,
              data.jsview
            )
            view.needGoIn = true
            app.trigger('View.ajax.complete')
            app.GlobalView.setTitle(data.title)
            app.GlobalView.selectCurrentMenu(data.sectionId)
            console.log('%cТекущая вьюшка = %s', 'color: green', data.jsview)
          } else {
            console.log('%c[data-view] не заполнено', 'color: red')
          }
        } else {
          console.log('%c[data-view] не найдено', 'color: red')
        }
      }, 'json')
    }

    this._pageCounter++
  },

  back: function () {
    const self = this
    if (self.lastPath) {
      self.lastPath = self.curPath = false
      window.history.back()
    } else {
      self.lastPath = self.curPath = false
      self.navigate('/', true)
    }
  }

})
