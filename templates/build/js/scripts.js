'use strict';

(function () {
  'use strict';

  // app.utils.transformPrefix = Modernizr.testAllProps('transform','pfx');

  // app.utils.transitionPrefix = Modernizr.testAllProps('transition','pfx');

  app.utils.getData = null;
  /**
   * Возвращает текущую позицию скрола
   * @returns {Number}
   */
  app.utils.getScrollPosition = function () {
    if (window.scrollY !== undefined) {
      return window.scrollY;
    } else if (document.documentElement && document.documentElement.scrollTop) {
      // for ie
      return document.documentElement.scrollTop;
    }
    return 0;
  };

  /**
   * Склоняем слова
   * @param {Number}  number
   * @param {String}  one
   * @param {String}  two
   * @param {String}  five
   * @returns {*}
   */
  app.utils.okonchanie = function (number, one, two, five) {
    var poslezpt = parseInt(number) !== parseFloat(number);

    number += '';
    if (number.length > 1 && +number.substr(number.length - 2, 1) === '1' || +number.substr(number.length - 1, 1) > 4 && +number.substr(number.length - 1, 1) < 10 && !poslezpt) {
      // 10 - 19 || 5 - 10
      return five;
    } else if (number.substr(number.length - 1, 1) === '1' && !poslezpt) {
      // 1
      return one;
    } else {
      // 2 - 4, 1.5
      return two;
    }
  };

  /**
   * Определяем мобильное или нет устройство
   * @return {boolean}
   */
  app.utils.isIPhone = function () {
    return (/iPhone|iPod/i.test(navigator.userAgent)
    );
  };

  /**
   * Парсит GET. Возвращает объект в виде ключ -> значение
   * @returns {Object}
   */
  app.utils.parseUrlQuery = function (link) {
    var qu = link && link.indexOf('?');
    var data = {};
    var i = void 0;
    var param = void 0;
    var pair = void 0;

    if (link) {
      if (qu !== -1) {
        link = link.substr(qu + 1);
      } else {
        link = null;
      }
    } else {
      link = location.search && location.search.substr(1);
    }

    if (link) {
      pair = link.split('&');
      for (i = 0; i < pair.length; i++) {
        param = pair[i].split('=');
        data[param[0]] = param[1];
      }
    }
    return data;
  };

  /**
   * Добавляем get параметр в урл
   * @param {String}  key
   * @param {String}  value
   */
  app.utils.insertParam = function (key, value) {
    key = encodeURI(key);
    value = encodeURI(value);

    var kvp = document.location.search.substr(1).split('&');
    var i = kvp.length;
    var x = void 0;
    while (i--) {
      x = kvp[i].split('=');
      // console.log(x, i);
      if (x[0] === key) {
        x[1] = value;
        kvp[i] = x.join('=');
        break;
      }
    }

    if (i < 0) {
      kvp[kvp.length] = [key, value].join('=');
    }

    // this will reload the page, it's likely better to store this until finished
    // document.location.search = kvp.join('&');
    var tempArr = [];
    _.each(kvp, function (num) {
      if (num !== '') {
        tempArr.push(num);
      }
    });
    return '?' + tempArr.join('&');
  };

  app.utils.insertParam2 = function (url, key, value) {
    // console.log(url)
    key = encodeURI(key);
    value = encodeURI(value);

    if (url.indexOf('?') !== -1) {
      url += '&' + [key, value].join('=');
    } else {
      url += '?' + [key, value].join('=');
    }

    return url;
  };

  /**
   * получаем ширину системного скролла
   * @return {number} Ширина скролла.
   */
  app.utils.scrollWidth = function () {
    // создадим элемент с прокруткой
    var div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';

    // при display:none размеры нельзя узнать
    // нужно, чтобы элемент был видим,
    // visibility:hidden - можно, т.к. сохраняет геометрию
    div.style.visibility = 'hidden';

    document.body.appendChild(div);
    var scrollWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
    return scrollWidth;
  };

  /**
   * Делает из однозначиного число, двузначное (с нулем перед значением)
   * @param number
   * @returns {string}
   */
  app.utils.doubleNumber = function (number) {
    number = number.toString();
    return number.length === 1 ? '0' + number : number;
  };

  /**
   * направление скролла window
   */
  app.utils.getDirection = {
    direction: 1,
    lastScrollTop: 0,
    init: function init() {
      var self = this;
      $(window).scroll(function () {
        var scroll = $(window).scrollTop();

        if (self.lastScrollTop <= scroll) {
          self.direction = 1;
        } else {
          self.direction = -1;
        }
        self.lastScrollTop = scroll;
      });
    }

    /**
     * Задает элементу высоту окна и подпивысает на ресайз
     * @param $obj - jQuery object
     * @param context - Object
     */
  };app.utils.heightLikeWindow = function ($obj, context) {
    _helper();
    app.on('resize', _helper, context);

    function _helper() {
      $obj.css({ 'height': app.Size.height });
    }
  };

  /**
   * Задает элементу высоту и ширину окна и подпивысает на ресайз
   * @param $obj - jQuery object
   * @param context - Object
   */
  app.utils.sizeLikeWindow = function ($obj, context) {
    _helper(app.Size.getSize());
    app.on('resize', _helper, context);

    function _helper(options) {
      $obj.css(options);
    }
  };

  /**
   * Получаем путь background-image
   * @param $obj - jQuery object
   */
  app.utils.getBackgroundImageUrl = function ($obj) {
    var style = $obj[0].currentStyle || window.getComputedStyle($obj[0], false);
    return style.backgroundImage.slice(4, -1).replace(/"/g, '');
  };

  /**
  * Создает функцию передающую полномочия одной из указанных функций, в зависимости от условия в state
  * Функция используется для создания комплексного метода объекта
  * @example
  * O = {
  *   method: app.utils.functionByState(<...>)
  * }
  * Может вызываться как: app.utils.functionByState(state,functions) или app.utils.functionByState(functions)
  * Где state может быть типа:
  *  string - название свойства объекта
  *  function - функция, возвращающея значение state определяющее искомую функцию в functions
  *  или по умолчанию 'state'
  * а functions - хэш функций, где ключами выступают возможные значения state или 'default' для действия по уолчанию
  *
  * При неверно заданных параметрах или отстуствующем в functions state возвращает функцию _.noop (которая возвращает undefined)
  *
  * @author Koshevarov Sergey <gondragos@gmail.com>
  */
  app.utils.functionByState = function (state, functions) {
    var getState = void 0;
    var func = void 0;
    if (_.isString(state)) {
      getState = _.property(state);
    } else if (_.isFunction(state)) {
      getState = state;
    } else if (arguments.length === 1 && _.isObject(state)) {
      getState = _.property('state');
      functions = state;
    } else {
      return _.noop;
    }
    func = function func() {
      return _.get(func, getState(this), _.get(func, 'default', _.noop)).apply(this, arguments);
    };
    _.each(functions, function (f, devices) {
      devices = devices.split(',');
      _.each(devices, function (device) {
        func[device] = f;
      });
    });
    return func;
  };

  /**
   * Частный случай app.utils.functionByState в качестве state использующий текущее значение deviceType в app.Adaptive
   *
   * @author Koshevarov Sergey <gondragos@gmail.com>
   */
  app.utils.functionByDevice = function (functions) {
    return app.utils.functionByState(_.bind(app.Adaptive.getDeviceType, app.Adaptive), functions);
  };
})();
;'use strict';

app.components.Loader = function () {
  'use strict';

  function Loader() {
    var self = this;
    this.obj = null;
    this.isVisible = false;
    this.nobg = false;

    function _init() {
      // self.obj = $(tpl);
      // self.obj.appendTo('.grid').hide();
      self.obj = $('.js-loader');
    }

    _init();
  }

  Loader.prototype.show = function () {
    if (!this.isVisible) {
      if (this.nobg) {
        this.obj.addClass('_nobg');
      }
      this.obj.fadeIn(300, function () {
        // app.dom.$window.scrollTop(0);
      });
      this.isVisible = true;
    }
    return this;
  };

  Loader.prototype.hide = function () {
    var self = this;
    if (self.isVisible) {
      _hide();
    }

    function _hide() {
      self.obj.stop().fadeOut(1000).removeClass('_nobg');
      self.nobg = false;
      self.isVisible = false;
    }
  };

  return new Loader();
}();
;'use strict';

app.components.Multiloader = function () {
  /**
   * @param minQueue
   * @constructor
   */
  var MultiLoader = function MultiLoader(minQueue) {
    this._queue = [];
    this._callback = null;
    this._minQueue = minQueue || 0;
    this._lastCreatedStack = 0;

    for (var i = 0; i < this._minQueue; i++) {
      this._queue.push(false);
    }
  };

  /**
   * Добавляем callback, который выполнится, когда все отложенные события будут завершены
   * @param callback
   * @param [scope]
   */
  MultiLoader.prototype.addCallback = function (callback, scope) {
    this._callback = callback;
    this._scope = scope || this;
  };

  /**
   * Создаеит и возвращает функцию, которая при выполнении отметит стек как выполненный
   * @returns {Function}
   */
  MultiLoader.prototype.createStack = function () {
    var that = this;
    var myNum = that._lastCreatedStack++;

    if (myNum > this._queue.length - 1) {
      that._queue.push(false);
    }

    return function () {
      that._checkStack(myNum);
    };
  };

  /**
   * Проверка стека за определенным номером
   * @param stackNum
   * @private
   */
  MultiLoader.prototype._checkStack = function (stackNum) {
    this._queue[stackNum] = true;

    if (_.every(this._queue)) {
      if (typeof this._callback === 'function') {
        this._callback.apply(this._scope);
      }
    }
  };

  return MultiLoader;
}();
;'use strict';

app.Size = function () {
  var _androidDelay = 300;
  var _minWidth = 320;
  var _minHeight = 212;

  function Size() {
    var __bind = function __bind(fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    };
    var _this = this;
    var _events = /iPod|iPad|iPhone/g.test(navigator.userAgent) ? 'orientationchange load' : 'resize load'; // айфон или все остальные

    _this.width = null;
    _this.height = null;
    _this.orientationChange = __bind(_this.orientationChange, _this);

    // делаем задержку для андроида
    if (/android/ig.test(navigator.userAgent)) {
      // app.dom.$window.on('orientationchange resize load', function() {
      app.dom.$window.on('load', function () {
        return setTimeout(_this.orientationChange, _androidDelay);
      });
    } else {
      app.dom.$window.on(_events, _this.orientationChange);
    }
    _this.orientationChange();
  }

  Size.prototype = {

    orientationChange: function orientationChange() {
      var that = this;
      var prevHeight = that.height;
      var prevWidth = that.width;

      // на больших компах или ноутах с тач экраном приводит
      // к неправильному определеню ширины экрана
      // that.width = Modernizr.touch ? window.innerWidth : app.dom.$window.width();
      that.height = Modernizr.touch ? window.innerHeight : app.dom.$window.height();

      that.width = app.dom.$window.width();
      that.width = Math.max(_minWidth, that.width);
      that.height = Math.max(_minHeight, that.height);

      if (that.width !== prevWidth || that.height !== prevHeight) {
        app.trigger('resize', that.getSize());
      }
    },

    getSize: function getSize() {
      return {
        width: this.width,
        height: this.height
      };
    }
  };

  return new Size();
}();
;'use strict';

app.ns('app.core').Behavior = Backbone.View.extend({

  target: '[data-behavior]',

  initialize: function initialize(config) {
    var self = this;
    self.params = config.params || self.defaults;
  },

  render: function render() {
    app.core.Behavior.__super__.render.apply(this, arguments);
    var self = this;
    var $targets = self.$(self.target);

    self.$targets = $targets;
    self.initAll($targets);
  },

  remove: function remove() {
    this.stopListening();
    return this;
  },

  initAll: function initAll($targets) {
    var self = this;
    _.map($targets, _.flow($, _.bind(self.initEach, self)));
  },

  initEach: function initEach() {},

  getParams: function getParams(data) {
    var self = this;
    var result = {};
    var datas = self.datas;

    _.each(datas, function (dataName, paramName) {
      var value = data[dataName];
      if (value) result[paramName] = value;
    });
    return result;
  },

  getOption: function getOption(key, params, validator) {
    var self = this;
    var ops = self.params;
    var dfs = self.defaults;
    var candidats = [params[key], ops[key], dfs[key]];
    var res = void 0;

    validator = validator || _.negate(_.isUndefined);
    candidats = _.map(candidats, self._getValue);
    res = _.find(candidats, validator);
    return res;
  },
  _getValue: function _getValue(value) {
    return _.isFunction(value) ? value() : value;
  }
});
;'use strict';

;(function () {
  var View = app.ns('app.core').View = Backbone.View.extend({
    subView: {},
    constructor: function constructor(options) {
      var self = this;
      var newOptions = ['ui', 'gui', 'tpls', 'behaviors', 'subView', 'subViews'];
      options = options || {};
      applyOptions.call(self, options, newOptions);
      self.behaviors = [];
      self.subView = {};
      self.subViews = [];
      normalizeEvents.call(self, options);
      View.__super__.constructor.apply(self, [options]);
    },
    _setElement: function _setElement() {
      var self = this;
      View.__super__._setElement.apply(self, arguments);
      initUIs.call(self);
      initTpls.call(self);
      clearBehaviors.call(self);
      initBehaviors.call(self);
      clearSubViews.call(self);
      initSubViews.call(self);
    },
    remove: function remove() {
      var self = this;
      self.off();
      app.off(null, null, self);
      clearUIs.call(self);
      clearTpls.call(self);
      clearBehaviors.call(self);
      clearSubViews.call(self);
      View.__super__.remove.apply(self, arguments);
    }
  });

  function applyOptions(options, applyList) {
    var self = this;
    _.each(_.pick(_.defaults(options, self), applyList), function (option, optionName) {
      self[optionName] = option;
      self['_' + optionName] = _.clone(option);
    });
  }

  function initUIs() {
    var self = this;
    self.ui = _.reduce(self._ui, function (ui, selector, key) {
      ui[key] = self.$(selector);
      return ui;
    }, {});
    self.gui = _.reduce(self._gui, function (gui, selector, key) {
      gui[key] = $(selector);
      return gui;
    }, {});
  }

  function clearUIs() {
    var self = this;
    _.invoke(self.ui, 'off');
    self.ui = {};
    _.invoke(self.gui, 'off');
    self.gui = {};
  }

  function normalizeEvents(options) {
    this.events = normalizeKeys.call(this, this.events);
    options.events = normalizeKeys.call(this, options.events);
  }

  function normalizeKeys(hash) {
    var self = this;
    return _.reduce(hash, function (memo, val, key) {
      var normalizedKey = normalizeUIString.call(self, key);
      memo[normalizedKey] = val;
      return memo;
    }, {});
  }

  function normalizeUIString(uiString) {
    var self = this;
    var ui = self._ui;
    return uiString.replace(/@ui\.[a-zA-Z-_$0-9]*/g, function (r) {
      return ui[r.slice(4)];
    });
    // .replace(/@gui\.[a-zA-Z-_$0-9]*/g, function(r) {
    //    return gui[r.slice(5)];
    // });
  }

  function initTpls() {
    var self = this;
    self.tpls = _.reduce(self._tpls, function (tpls, selector, key) {
      var $tpl = $(['[id="', selector, '"]'].join(''));
      var tpl = void 0;
      if ($tpl.length) {
        tpl = $tpl.html();
      } else {
        tpl = selector;
      }
      tpls[key] = _.template(tpl);
      return tpls;
    }, {});
  }

  function clearTpls() {
    var self = this;
    self.tpls = {};
  }

  function initBehaviors() {
    var self = this;
    self.behaviors = [];
    _.each(self._behaviors, function (Behavior) {
      var params = {};
      var el = void 0;
      if (_.isObject(Behavior)) {
        params = Behavior.params;
        el = Behavior.el;
        Behavior = Behavior.behavior;
      }
      if (Behavior = app.ns('behaviors', app)[Behavior]) {
        var behavior = new Behavior({
          el: el || self.$el,
          params: params
        });
        self.behaviors.push(behavior);
        behavior.render();
      }
    });
  }

  function clearBehaviors() {
    var self = this;
    if (self.behaviors) {
      _.each(self.behaviors, function (item, key) {
        app.off(null, null, item);
        item.remove();
        delete self.behaviors[key];
      });
      self.behaviors = [];
    }
  }

  function initSubViews() {
    var self = this;
    _.each(self._subViews, function (subView) {
      var params = normalizeSubViewParams(subView);
      var el = params.el;
      params.SubView = params.subView;
      if (el) {
        el = self.$(el);
        _.each(el, function (item) {
          var _subView = new params.SubView(_.defaults({ el: item }, params.options));
          self.subViews.push(_subView);
          _subView.render();
        });
      } else {
        var _subView = new params.SubView(params.options);
        self.subViews.push(_subView);
        _subView.render();
      }
    });
    _.each(self._subView, function (subView, key) {
      var params = normalizeSubViewParams(subView);
      params.SubView = params.subView;
      var _subView = new params.SubView(params.options);
      self.subView[key] = _subView;
      _subView.render();
    });
  }

  function normalizeSubViewParams(subView) {
    var options = {};
    var el = false;
    if (_.isObject(subView)) {
      options = subView.options || {};
      el = subView.el || el;
      subView = subView.subView;
    }
    if (_.isString(subView)) {
      subView = app.subViews[subView];
    }
    return {
      subView: subView,
      options: options,
      el: el
    };
  }

  function clearSubViews() {
    var self = this;
    _.each(self.subView, function (item, key) {
      app.off(null, null, item);
      item.remove();
      delete self.subView[key];
    });
    self.subView = {};
    _.each(self.subViews, function (item, key) {
      app.off(null, null, item);
      item.remove();
      delete self.subViews[key];
    });
    self.subViews = [];
  }
})();
;'use strict';

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

  initialize: function initialize() {
    this.loader = app.components.loader;
    // this.popup = app.components.PopUp;

    app.on('checkGetParams', this.checkGetParams, this);
  },

  /**
   * Во вьюху пришел html
   * @param {String}    html
   * @param {String}    className
   */
  setProps: function setProps(html, className) {
    this.html = html;
    this.className = className;
  },

  render: function render() {
    var self = this;

    // принцип загрузки страницы
    // 1. Показываем прелоадер
    // 2. Добавляем дом с контентом из аякса
    // 3. Ждем пока загрузятся все отмеченые картинки
    // 4. После этого идет инициализация всех скриптов вьюхи
    // 5. После этого скрываем прелоадер и проводим анимацию появления контента страницы

    self.defLoadAllImages = $.Deferred();
    self.defRenderEnd = $.Deferred();

    self.defLoaderHide = $.when(self.defLoadAllImages, self.defRenderEnd);
    self.defLoaderHide.done(function () {
      // console.log('defLoaderHide')
      self.goIn();
      self.loader.hide();
    });

    app.dom.$window.scrollTop(0);

    if (self.html) {
      app.GlobalView.$el.append(self.html);
      self.setElement(app.GlobalView.$el.find('[data-view="' + self.className + '"]'));
      app.trigger('dom.append');
    }

    var $waitToLoad = $('[data-wait-to-load]');
    // let n = 0
    var all = $waitToLoad.length;

    if (all) {
      var multiLoader = new app.components.Multiloader($waitToLoad.length);
      multiLoader.addCallback(function () {
        // когда все картинку будут загружены, резолвим дефферер
        // console.log('multiLoader.addCallback')
        self.defLoadAllImages.resolve();
      });

      $waitToLoad.each(function (key, value) {
        var image = new Image();
        image.onload = function () {
          multiLoader.createStack()();
          // n++;

          // self.loader.percentage(n,all);

          if ($(value).is('img')) {
            $(value).attr('src', this.src);
          }
        };

        if ($(this).is('img')) {
          image.src = $(this).data('waitToLoad');
        } else {
          image.src = app.utils.getBackgroundImageUrl($(this));
        }
      });
    } else {
      self.defLoadAllImages.resolve();
    }
  },

  afterRender: function afterRender() {
    this.defRenderEnd.resolve();
    this.checkGetParams();
  },

  checkGetParams: function checkGetParams() {
    if (!app.utils.getData) {
      app.utils.getData = app.utils.parseUrlQuery(window.location.search);
    }

    var $target = void 0;

    if (app.utils.getData['goto']) {
      $target = $(app.utils.getData['goto']);
      if ($target.length) {
        if (!app.Router._pageCounter) {
          $(window).load(_helper);
        } else {
          _helper();
        }
      }
    } else {
      $target = $('body');
      _helper();
    }

    function _helper() {
      /* var index = -1;
      var section = window.location.pathname.split('/')[1];
        if (app.utils.getData['goto'] == 'guarantee') index = 5;
        else if (section == 'information') index = 4;
        if (index > -1) app.GlobalView.selectCurrentMenu(index); */

      setTimeout(function () {
        $('html, body').stop(true, true).animate({ 'scrollTop': $target.offset().top }, 500);
      }, 310);
    }
  },

  goOutDefault: function goOutDefault() {
    var self = this;
    app.trigger('View.goOutDefaultStart');
    // self.$el.fadeOut(600, function(){
    setTimeout(function () {
      self.remove();
      app.trigger('View.goOutDefaultEnd');
    }, 300);

    // });
  },

  goIn: function goIn() {
    var self = this;
    self.$el.css({ 'display': 'none' });
    self.$el.fadeIn(600);
    app.trigger('View.goIn');
  },

  remove: function remove() {
    var self = this;
    self.trigger('remove');
    app.core.Page.__super__.remove.apply(self, arguments);
  },

  initGoto: function initGoto() {
    this.$el.on('click', '[data-goto]', function (e) {
      e.preventDefault();
      $('html, body').animate({ 'scrollTop': $($(this).data('goto')).offset().top - app.Header.$el.find('[data-head-top]').height() }, 500);
    });
  }

});
;'use strict';

(function () {
  'use strict';

  var el = '[data-behavior]';
  var subView = app.ns('app.behaviors').Behavior1 = app.core.Behavior.extend({
    target: el,

    initEach: function initEach($target) {
      console.log('%c%s', 'color: indigo', 'Behavior1 render', $target);
    }
  });
  subView.el = el;
})();
;'use strict';

/**
 * class  app.views.Footer
 * @extends  Backbone.View
 */

app.ns('app.views').Footer = app.core.View.extend({

  el: '.footer',

  render: function render() {
    app.views.Footer.__super__.render.apply(this, arguments);
  }

});
;'use strict';

app.ns('app.views').GlobalView = Backbone.View.extend({

  oldViews: [],
  currentView: null,
  loader: null,
  menuItems: null,

  initialize: function initialize() {
    this.loader = app.components.loader;
    this.menuItems = $('[data-head-menu-item]');
  },

  selectCurrentMenu: function selectCurrentMenu(id) {
    if (id === undefined) id = 0;
    this.menuItems.removeClass('_active').filter('[data-head-menu-item="' + id + '"]').addClass('_active');
  },

  show: function show(View) {
    var self = this;
    View.render();
    self.currentView = View;
  },

  hide: function hide() {
    var self = this;
    app.once('View.goOutDefaultStart', function () {
      self.loader.show();
    });
    self.currentView.goOutDefault();
  },

  setTitle: function setTitle(title) {
    $('title').html(title);
  }

});
;'use strict';

app.ns('app.views').Header = app.core.View.extend({

  el: '.header',
  subView: {},

  initialize: function initialize() {},

  render: function render() {
    app.views.Header.__super__.render.apply(this, arguments);
  }
});

function _calendar() {
  var book1 = [];
  $('.dropDown').select2();
  $('select.dropDown').change(function () {
    book1 = $(this).val().split(',');
    $('.datepicker, .time-select, .sheme--container, .calendar--form').slideUp();
    $('.datepicker').datepicker('refresh');
    $('.datepicker').slideDown();
  });
  $('.datepicker').datepicker({
    numberOfMonths: 3,
    language: 'ru',
    minDate: 0,
    beforeShowDay: function beforeShowDay(date) {
      var m = date.getMonth();
      var d = date.getDate();
      var y = date.getFullYear();
      // for (var $b2 = 0; $b2 < book2.length; $b2++) {
      //   if ($.inArray(y + '-' + (m + 1) + '-' + d, book2) !== -1) {
      //     return [true, 'ui-state-active__n2', '']
      //   }
      // }
      for (var $b1 = 0; $b1 < book1.length; $b1++) {
        if ($.inArray(y + '-' + (m + 1) + '-' + d, book1) !== -1) {
          return [true, 'ui-state-active__n1', ''];
        }
      }
      return [true];
    },
    onSelect: function onSelect(dateText, inst) {
      console.log('dateText ' + dateText);
      $('.time-select, .sheme--container, .calendar--form').slideUp();
      $('.place').removeClass('place__selected');
      $('.time-select').slideDown();
    }
  });
}

function _selectPlace() {
  $('.time-select--label').click(function () {
    $('.calendar--form').slideUp();
    $('.sheme--container').slideDown();
    $('.place').removeClass('place__selected');
  });
  $('.place').click(function () {
    if ($(this).hasClass('place__booking')) {} else {
      $(this).toggleClass('place__selected');
      $('.place__selected').length !== 0 ? $('.calendar--form').slideDown() : $('.calendar--form').slideUp();
    }
  });
}

function _mobileMenu() {
  $('.burger').click(function () {
    $('.header--nav, .header--login, .header--nav--menu').toggleClass('header__open--nav');
    $(this).toggleClass('burger__open');
  });
}

$(document).ready(_calendar(), _selectPlace(), _mobileMenu());
;'use strict';

app.ns('app.views').Index = app.core.Page.extend({

  events: {},

  behaviors: [
    // 'Behavior1'
  ],

  subView: {
    // subView1: 'subView1'
  },

  initialize: function initialize() {
    app.views.Index.__super__.initialize.apply(this, arguments);
  },

  remove: function remove() {
    app.views.Index.__super__.remove.apply(this, arguments);
  },

  render: function render() {
    app.views.Index.__super__.render.apply(this, arguments);

    app.views.Index.__super__.afterRender.apply(this, arguments);
  }
});
;'use strict';

/**
 * @class app.views.NotFound
 * @extends app.core.Page
 */

app.ns('app.views').NotFound = app.core.Page.extend({

  remove: function remove() {
    app.views.NotFound.__super__.remove.apply(this, arguments);
  },

  render: function render() {
    app.views.NotFound.__super__.render.apply(this, arguments);
  }

});
;'use strict';

app.ns('app.views').Profile = app.core.Page.extend({

  events: {},

  behaviors: [
    // 'Behavior1'
  ],

  subView: {
    // subView1: 'subView1'
  },

  initialize: function initialize() {
    app.views.Profile.__super__.initialize.apply(this, arguments);
  },

  remove: function remove() {
    app.views.Profile.__super__.remove.apply(this, arguments);
  },

  render: function render() {
    app.views.Profile.__super__.render.apply(this, arguments);

    app.views.Profile.__super__.afterRender.apply(this, arguments);
  }
});

function previewFile() {
  var preview = document.querySelector('.avatar');
  var file = document.querySelector('input[type=file]').files[0];
  var reader = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
  }
}

function _editProfile() {
  $('.avatar--wrapper').click(function () {
    $('.avatar--download').trigger('click');
  });

  $('.avatar--download').change(function (e) {
    previewFile();
  });
}

function _editTrip() {
  $('.trip--btn, .trip--save').click(function () {
    $('.trip__container .edit__container').slideToggle();
  });
}

$(document).ready(_editProfile(), _editTrip());
;'use strict';

app.ns('app.views').Route = app.core.Page.extend({

  events: {},

  behaviors: [
    // 'Behavior1'
  ],

  subView: {
    // subView1: 'subView1'
  },

  initialize: function initialize() {
    app.views.Route.__super__.initialize.apply(this, arguments);
  },

  remove: function remove() {
    app.views.Route.__super__.remove.apply(this, arguments);
  },

  render: function render() {
    app.views.Route.__super__.render.apply(this, arguments);

    app.views.Route.__super__.afterRender.apply(this, arguments);
  }
});
;'use strict';

(function () {
  'use strict';

  var el = '[data-subview1]';

  var subView = app.ns('app.subViews').subView1 = app.core.View.extend({

    el: el,

    behaviors: [],
    subView: {},
    subViews: [],
    ui: {},
    gui: {},
    events: {},
    cls: {},
    data: {},

    initialize: function initialize() {
      subView.__super__.initialize.apply(this, arguments);
    },

    remove: function remove() {
      subView.__super__.remove.apply(this, arguments);
      console.log('%c%s', 'color: darkorange', 'subView1 remove');
    },

    render: function render() {
      subView.__super__.render.apply(this, arguments);
      console.log('%c%s', 'color: orange', 'subView1 render');
    }
  });

  subView.el = el;
})();
;'use strict';

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

  baseRout: function baseRout() {
    var self = this;
    var path = Backbone.history.fragment || './';
    var View = 'NotFound';
    var view = void 0;

    self.lastPath = self.curPath;
    self.curPath = path;
    if (!this._pageCounter) {
      var $view = $('[data-view]');
      if ($view.length) {
        if ($.trim($view.data('view')) !== '') {
          View = app.views[$view.data('view')];
          view = new View({ el: $view });
          app.GlobalView.show(view);
          console.log('%cТекущая вьюшка = %s', 'color: green', $view.data('view'));
        } else {
          console.log('%c[data-view] не заполнено', 'color: red');
        }
      } else {
        console.log('%c[data-view] не найдено', 'color: red');
      }
    } else {
      // стандартное смена страниц через
      // fadeOut->display preloader->none preloader->fadeIn
      var p1 = $.Deferred();
      var p2 = $.Deferred();
      var p3 = $.when(p1, p2);

      p3.done(function () {
        if (view.html) {
          app.GlobalView.show(view);
        }
      });

      app.once('View.goOutDefaultEnd', function () {
        p1.resolve();
      });
      app.once('View.ajax.complete', function () {
        p2.resolve();
      });

      app.GlobalView.hide();

      $.get(path, {
        _: _.now()
      }, function (data) {
        if (data.jsview) {
          if ($.trim(data.jsview) !== '') {
            view = new app.views[data.jsview]();
            view.setProps(data.body, data.jsview);
            view.needGoIn = true;
            app.trigger('View.ajax.complete');
            app.GlobalView.setTitle(data.title);
            app.GlobalView.selectCurrentMenu(data.sectionId);
            console.log('%cТекущая вьюшка = %s', 'color: green', data.jsview);
          } else {
            console.log('%c[data-view] не заполнено', 'color: red');
          }
        } else {
          console.log('%c[data-view] не найдено', 'color: red');
        }
      }, 'json');
    }

    this._pageCounter++;
  },

  back: function back() {
    var self = this;
    if (self.lastPath) {
      self.lastPath = self.curPath = false;
      window.history.back();
    } else {
      self.lastPath = self.curPath = false;
      self.navigate('/', true);
    }
  }

});
;"use strict";

// Запускаем приложение
$(function () {
  app.initialize();
});
;"use strict";

$(function () {
  svg4everybody();
});
//# sourceMappingURL=scripts.js.map
