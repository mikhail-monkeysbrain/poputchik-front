app.components.Loader = (function () {
  'use strict'

  function Loader () {
    const self = this
    this.obj = null
    this.isVisible = false
    this.nobg = false

    function _init () {
      // self.obj = $(tpl);
      // self.obj.appendTo('.grid').hide();
      self.obj = $('.js-loader')
    }

    _init()
  }

  Loader.prototype.show = function () {
    if (!this.isVisible) {
      if (this.nobg) {
        this.obj.addClass('_nobg')
      }
      this.obj.fadeIn(300, function () {
        // app.dom.$window.scrollTop(0);
      })
      this.isVisible = true
    }
    return this
  }

  Loader.prototype.hide = function () {
    const self = this
    if (self.isVisible) {
      _hide()
    }

    function _hide () {
      self.obj.stop().fadeOut(1000).removeClass('_nobg')
      self.nobg = false
      self.isVisible = false
    }
  }

  return new Loader()
})()
