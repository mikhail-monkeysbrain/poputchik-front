'use strict'

/**
 * class  app.views.Default
 * @extends  Backbone.View
 */
app.ns('app.core').Page = app.core.View.extend({

  loader: null,
  popup: null,
  html: null,
  needGoIn: false,
  className: null,
  pageHolder: null,
  $bigGallery: null,

  defLoadAllImages: null,
  defGoIn: null,
  defLoaderHide: null,
  defaultLoaderHide: true,

  initialize: function () {
    this.loader = app.components.loader
    // this.popup = app.components.PopUp;

    app.on('checkGetParams', this.checkGetParams, this)
  },

  /**
   * Во вьюху пришел html
   * @param {String}    html
   * @param {String}    className
   */
  setProps: function (html, className) {
    this.html = html
    this.className = className
  },

  render: function () {
    const self = this

    // принцип загрузки страницы
    // 1. Показываем прелоадер
    // 2. Добавляем дом с контентом из аякса
    // 3. Ждем пока загрузятся все отмеченые картинки
    // 4. После этого идет инициализация всех скриптов вьюхи
    // 5. После этого скрываем прелоадер и проводим анимацию появления контента страницы

    self.defLoadAllImages = $.Deferred()
    self.defRenderEnd = $.Deferred()

    self.defLoaderHide = $.when(self.defLoadAllImages, self.defRenderEnd)
    self.defLoaderHide.done(function () {
      // console.log('defLoaderHide')
      self.goIn()
      self.loader.hide()
    })

    app.dom.$window.scrollTop(0)

    if (self.html) {
      app.GlobalView.$el.append(self.html)
      self.setElement(app.GlobalView.$el.find('[data-view="' + self.className + '"]'))
      app.trigger('dom.append')
    }

    const $waitToLoad = $('[data-wait-to-load]')
    // let n = 0
    const all = $waitToLoad.length

    if (all) {
      const multiLoader = new app.components.Multiloader($waitToLoad.length)
      multiLoader.addCallback(function () {
        // когда все картинку будут загружены, резолвим дефферер
        // console.log('multiLoader.addCallback')
        self.defLoadAllImages.resolve()
      })

      $waitToLoad.each(function (key, value) {
        const image = new Image()
        image.onload = function () {
          multiLoader.createStack()()
          // n++;

          // self.loader.percentage(n,all);

          if ($(value).is('img')) {
            $(value).attr('src', this.src)
          }
        }

        if ($(this).is('img')) {
          image.src = $(this).data('waitToLoad')
        } else {
          image.src = app.utils.getBackgroundImageUrl($(this))
        }
      })
    } else {
      self.defLoadAllImages.resolve()
    }
  },

  afterRender: function () {
    this.defRenderEnd.resolve()
    this.checkGetParams()
  },

  checkGetParams: function () {
    if (!app.utils.getData) {
      app.utils.getData = app.utils.parseUrlQuery(window.location.search)
    }

    let $target

    if (app.utils.getData['goto']) {
      $target = $(app.utils.getData['goto'])
      if ($target.length) {
        if (!app.Router._pageCounter) {
          $(window).load(_helper)
        } else {
          _helper()
        }
      }
    } else {
      $target = $('body')
      _helper()
    }

    function _helper () {
      /* var index = -1;
      var section = window.location.pathname.split('/')[1];

      if (app.utils.getData['goto'] == 'guarantee') index = 5;
        else if (section == 'information') index = 4;

      if (index > -1) app.GlobalView.selectCurrentMenu(index); */

      setTimeout(function () {
        $('html, body').stop(true, true).animate({'scrollTop': $target.offset().top}, 500)
      }, 310)
    }
  },

  goOutDefault: function () {
    const self = this
    app.trigger('View.goOutDefaultStart')
    // self.$el.fadeOut(600, function(){
    setTimeout(function () {
      self.remove()
      app.trigger('View.goOutDefaultEnd')
    }, 300)

    // });
  },

  goIn: function () {
    const self = this
    self.$el.css({'display': 'none'})
    self.$el.fadeIn(600)
    app.trigger('View.goIn')
  },

  remove: function () {
    const self = this
    self.trigger('remove')
    app.core.Page.__super__.remove.apply(self, arguments)
  },

  initGoto: function () {
    this.$el.on('click', '[data-goto]', function (e) {
      e.preventDefault()
      $('html, body').animate({'scrollTop': $($(this).data('goto')).offset().top - app.Header.$el.find('[data-head-top]').height()}, 500)
    })
  }

})
