app.ns('app.views').Route = app.core.Page.extend({

  events: {
  },

  behaviors: [
    // 'Behavior1'
  ],

  subView: {
    // subView1: 'subView1'
  },

  initialize: function () {
    app.views.Route.__super__.initialize.apply(this, arguments)
  },

  remove: function () {
    app.views.Route.__super__.remove.apply(this, arguments)
  },

  render: function () {
    app.views.Route.__super__.render.apply(this, arguments)

    app.views.Route.__super__.afterRender.apply(this, arguments)
  }
})
