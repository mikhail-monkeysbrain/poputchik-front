'use strict'

/**
 * @class app.views.NotFound
 * @extends app.core.Page
 */
app.ns('app.views').NotFound = app.core.Page.extend({

  remove: function () {
    app.views.NotFound.__super__.remove.apply(this, arguments)
  },

  render: function () {
    app.views.NotFound.__super__.render.apply(this, arguments)
  }

})
