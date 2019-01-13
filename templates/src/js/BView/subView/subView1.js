(function () {
  'use strict'

  const el = '[data-subview1]'

  const subView = app.ns('app.subViews').subView1 = app.core.View.extend({

    el: el,

    behaviors: [],
    subView: {},
    subViews: [],
    ui: {},
    gui: {},
    events: {},
    cls: {},
    data: {},

    initialize: function () {
      subView.__super__.initialize.apply(this, arguments)
    },

    remove: function () {
      subView.__super__.remove.apply(this, arguments)
      console.log('%c%s', 'color: darkorange', 'subView1 remove')
    },

    render: function () {
      subView.__super__.render.apply(this, arguments)
      console.log('%c%s', 'color: orange', 'subView1 render')
    }
  })

  subView.el = el
}())
