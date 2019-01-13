'use strict'

app.ns('app.views').Header = app.core.View.extend({

  el: '.header',
  subView: {},

  initialize: function () {

  },

  render: function () {
    app.views.Header.__super__.render.apply(this, arguments)
  }
})
