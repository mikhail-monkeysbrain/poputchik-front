'use strict'

/**
 * class  app.views.Footer
 * @extends  Backbone.View
 */
app.ns('app.views').Footer = app.core.View.extend({

  el: '.footer',

  render: function () {
    app.views.Footer.__super__.render.apply(this, arguments)
  }

})
