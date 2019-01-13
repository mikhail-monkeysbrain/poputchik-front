(function () {
  'use strict'

  const el = '[data-behavior]'
  const subView = app.ns('app.behaviors').Behavior1 = app.core.Behavior.extend({
    target: el,

    initEach: function ($target) {
      console.log('%c%s', 'color: indigo', 'Behavior1 render', $target)
    }
  })
  subView.el = el
}())
