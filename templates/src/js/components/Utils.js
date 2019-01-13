(function () {
  'use strict'

  // app.utils.transformPrefix = Modernizr.testAllProps('transform','pfx');

  // app.utils.transitionPrefix = Modernizr.testAllProps('transition','pfx');

  app.utils.getData = null
  /**
   * Возвращает текущую позицию скрола
   * @returns {Number}
   */
  app.utils.getScrollPosition = function () {
    if (window.scrollY !== undefined) {
      return window.scrollY
    } else if (document.documentElement && document.documentElement.scrollTop) { // for ie
      return document.documentElement.scrollTop
    }
    return 0
  }

  /**
   * Склоняем слова
   * @param {Number}  number
   * @param {String}  one
   * @param {String}  two
   * @param {String}  five
   * @returns {*}
   */
  app.utils.okonchanie = function (number, one, two, five) {
    const poslezpt = parseInt(number) !== parseFloat(number)

    number += ''
    if ((number.length > 1 && +number.substr(number.length - 2, 1) === '1') || (+number.substr(number.length - 1, 1) > 4 && +number.substr(number.length - 1, 1) < 10 && !poslezpt)) {
      // 10 - 19 || 5 - 10
      return five
    } else if (number.substr(number.length - 1, 1) === '1' && !poslezpt) {
      // 1
      return one
    } else {
      // 2 - 4, 1.5
      return two
    }
  }

  /**
   * Определяем мобильное или нет устройство
   * @return {boolean}
   */
  app.utils.isIPhone = function () {
    return /iPhone|iPod/i.test(navigator.userAgent)
  }

  /**
   * Парсит GET. Возвращает объект в виде ключ -> значение
   * @returns {Object}
   */
  app.utils.parseUrlQuery = function (link) {
    let qu = link && link.indexOf('?')
    let data = {}
    let i
    let param
    let pair

    if (link) {
      if (qu !== -1) {
        link = link.substr(qu + 1)
      } else {
        link = null
      }
    } else {
      link = location.search && location.search.substr(1)
    }

    if (link) {
      pair = (link).split('&')
      for (i = 0; i < pair.length; i++) {
        param = pair[i].split('=')
        data[param[0]] = param[1]
      }
    }
    return data
  }

  /**
   * Добавляем get параметр в урл
   * @param {String}  key
   * @param {String}  value
   */
  app.utils.insertParam = function (key, value) {
    key = encodeURI(key)
    value = encodeURI(value)

    const kvp = document.location.search.substr(1).split('&')
    let i = kvp.length
    let x
    while (i--) {
      x = kvp[i].split('=')
      // console.log(x, i);
      if (x[0] === key) {
        x[1] = value
        kvp[i] = x.join('=')
        break
      }
    }

    if (i < 0) {
      kvp[kvp.length] = [key, value].join('=')
    }

    // this will reload the page, it's likely better to store this until finished
    // document.location.search = kvp.join('&');
    const tempArr = []
    _.each(kvp, function (num) {
      if (num !== '') {
        tempArr.push(num)
      }
    })
    return '?' + tempArr.join('&')
  }

  app.utils.insertParam2 = function (url, key, value) {
    // console.log(url)
    key = encodeURI(key)
    value = encodeURI(value)

    if (url.indexOf('?') !== -1) {
      url += '&' + [key, value].join('=')
    } else {
      url += '?' + [key, value].join('=')
    }

    return url
  }

  /**
   * получаем ширину системного скролла
   * @return {number} Ширина скролла.
   */
  app.utils.scrollWidth = function () {
    // создадим элемент с прокруткой
    const div = document.createElement('div')

    div.style.overflowY = 'scroll'
    div.style.width = '50px'
    div.style.height = '50px'

    // при display:none размеры нельзя узнать
    // нужно, чтобы элемент был видим,
    // visibility:hidden - можно, т.к. сохраняет геометрию
    div.style.visibility = 'hidden'

    document.body.appendChild(div)
    const scrollWidth = div.offsetWidth - div.clientWidth
    document.body.removeChild(div)
    return scrollWidth
  }

  /**
   * Делает из однозначиного число, двузначное (с нулем перед значением)
   * @param number
   * @returns {string}
   */
  app.utils.doubleNumber = function (number) {
    number = number.toString()
    return number.length === 1 ? '0' + number : number
  }

  /**
   * направление скролла window
   */
  app.utils.getDirection = {
    direction: 1,
    lastScrollTop: 0,
    init: function () {
      const self = this
      $(window).scroll(function () {
        const scroll = $(window).scrollTop()

        if (self.lastScrollTop <= scroll) {
          self.direction = 1
        } else {
          self.direction = -1
        }
        self.lastScrollTop = scroll
      })
    }
  }

  /**
   * Задает элементу высоту окна и подпивысает на ресайз
   * @param $obj - jQuery object
   * @param context - Object
   */
  app.utils.heightLikeWindow = function ($obj, context) {
    _helper()
    app.on('resize', _helper, context)

    function _helper () {
      $obj.css({'height': app.Size.height})
    }
  }

  /**
   * Задает элементу высоту и ширину окна и подпивысает на ресайз
   * @param $obj - jQuery object
   * @param context - Object
   */
  app.utils.sizeLikeWindow = function ($obj, context) {
    _helper(app.Size.getSize())
    app.on('resize', _helper, context)

    function _helper (options) {
      $obj.css(options)
    }
  }

  /**
   * Получаем путь background-image
   * @param $obj - jQuery object
   */
  app.utils.getBackgroundImageUrl = function ($obj) {
    const style = $obj[0].currentStyle || window.getComputedStyle($obj[0], false)
    return style.backgroundImage.slice(4, -1).replace(/"/g, '')
  }

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
    let getState
    let func
    if (_.isString(state)) {
      getState = _.property(state)
    } else if (_.isFunction(state)) {
      getState = state
    } else if (arguments.length === 1 && _.isObject(state)) {
      getState = _.property('state')
      functions = state
    } else {
      return _.noop
    }
    func = function func () {
      return _.get(func, getState(this), _.get(func, 'default', _.noop)).apply(this, arguments)
    }
    _.each(functions, function (f, devices) {
      devices = devices.split(',')
      _.each(devices, function (device) {
        func[device] = f
      })
    })
    return func
  }

  /**
   * Частный случай app.utils.functionByState в качестве state использующий текущее значение deviceType в app.Adaptive
   *
   * @author Koshevarov Sergey <gondragos@gmail.com>
   */
  app.utils.functionByDevice = function (functions) {
    return app.utils.functionByState(_.bind(app.Adaptive.getDeviceType, app.Adaptive), functions)
  }
})()
