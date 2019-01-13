const app = (function () {
  'use strict'

  const Application = {

    el: '.grid', // рулит вьюхами страниц

    root: '', // папки в base path

    base: '', // base path

    // DOM
    dom: {
      $window: $(window),
      $document: $(document),
      $body: $('body'),
      $html: $('html')
    },

    // клавиатура
    keycodes: {
      CTRL: 17,
      SPACE: 32,
      SHIFT: 16,
      ESCAPE: 27,
      PAUSE_BREAK: 19
    },

    // утилиты
    utils: {},

    // компоненты
    components: {},

    // модули
    modules: {},

    // вьюхи
    views: {},

    // инициализация
    initialize: function () {
      this.base = $('base').attr('href')
      this.root = this.base.substr(8).substr(this.base.substr(8).indexOf('/'))

      this._initGlobal()
      this._initHistory()
    },

    // инициализация History API
    _initHistory: function () {
      const self = this
      let cancelRoute = false
      let routingLinks

      app.dom.$document
        .on('keydown', function (e) {
          if (e.keyCode === self.keycodes.CTRL || e.keyCode === self.keycodes.SHIFT) {
            cancelRoute = true
          }
        })
        .on('keyup', function (e) {
          if (e.keyCode === self.keycodes.CTRL || e.keyCode === self.keycodes.SHIFT) {
            cancelRoute = false
          }
        })

      this.dom.$window.on('popstate', function (e) {
        app.state = e.originalEvent.state
      })

      routingLinks = 'a' +
        ':not([data-not-ajax])' +
        ':not([target$="blank"])' +
        ':not([href$=".jpg"])' +
        ':not([href$=".png"])' +
        ':not([href$=".svg"])' +
        ':not([href$=".pdf"])'

      // Навешиваем события на ссылки
      this.dom.$document.on('click.routing', routingLinks, function (e) {
        if (!cancelRoute) {
          const $this = $(this)

          // Get the absolute anchor href.
          const href = {
            prop: $this.prop('href'),
            attr: $this.attr('href')
          }

          app.utils.getData = app.utils.parseUrlQuery(href.attr)

          if (href.attr === './') {
            href.attr = ''
          }

          if (href.prop.slice(0, self.base.length) === self.base) {
            e.preventDefault()
            const wUrl = window.location.protocol + '//' + window.location.hostname + window.location.pathname
            const gUrl = (href.prop).split('?')[0]
            const hUrl = gUrl.split('#')[0]
            if (wUrl === gUrl) {
              app.Router.navigate(href.attr, {trigger: false})
              // обрабатываем get параметры
              app.trigger('checkGetParams')
            } else if (wUrl === hUrl) {
              app.utils.getData['goto'] = '#' + gUrl.split('#')[1]
              app.trigger('checkGetParams')
            } else {
              app.Router.navigate(href.attr, {trigger: true})
            }
          }
        }
      })
    },

    _initGlobal: function () {
      app.utils.getDirection.init()
      app.components.loader = app.components.Loader
      app.components.loader.show()

      app.Router = new app.modules.Router() // роутинг урлов

      app.GlobalView = new app.views.GlobalView({el: $(this.el)}) // рулит вьюхами страниц

      app.Header = new app.views.Header() // вьюха хедера
      app.Footer = new app.views.Footer() // вьюха футера

      app.Header.render()
      app.Footer.render()

      Backbone.history.start({
        pushState: true,
        hashChange: false,
        root: this.root
      })

      // console.log('_initGlobal')
    },

    ns: function (namespace, root) {
      let ns
      let current
      ns = _.toPath(namespace)
      current = _.defaultTo(root, window)
      _.each(ns, function (propName) {
        current = current[propName] = _.get(current, propName, {})
      })
      return current
    }

  }

  _.extend(Application, Backbone.Events)

  return Application
})()
