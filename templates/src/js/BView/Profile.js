app.ns('app.views').Profile = app.core.Page.extend({

  events: {
  },

  behaviors: [
    // 'Behavior1'
  ],

  subView: {
    // subView1: 'subView1'
  },

  initialize: function () {
    app.views.Profile.__super__.initialize.apply(this, arguments)
  },

  remove: function () {
    app.views.Profile.__super__.remove.apply(this, arguments)
  },

  render: function () {
    app.views.Profile.__super__.render.apply(this, arguments)

    app.views.Profile.__super__.afterRender.apply(this, arguments)
  }
})

function previewFile () {
  var preview = document.querySelector('.avatar')
  var file = document.querySelector('input[type=file]').files[0]
  var reader = new FileReader()

  reader.onloadend = function () {
    preview.src = reader.result
  }

  if (file) {
    reader.readAsDataURL(file)
  } else {
    preview.src = ''
  }
}

function _editProfile () {
  $('.avatar--wrapper').click(function () {
    $('.avatar--download').trigger('click')
  })

  $('.avatar--download').change(function (e) {
    previewFile()
  })
}

function _editTrip () {
  $('.trip--btn, .trip--save').click(function () {
    $('.trip__container .edit__container').slideToggle()
  })
}

$(document).ready(
  _editProfile(),
  _editTrip()
)
