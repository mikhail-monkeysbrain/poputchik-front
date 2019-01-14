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

function _calendar () {
  var book1 = []
  $('.dropDown').select2()
  $('select.dropDown').change(function () {
    book1 = $(this).val().split(',')
    $('.datepicker, .time-select, .sheme--container, .calendar--form').slideUp()
    $('.datepicker').datepicker('refresh')
    $('.datepicker').slideDown()
  })
  $('.datepicker').datepicker({
    numberOfMonths: 3,
    language: 'ru',
    minDate: 0,
    beforeShowDay: function (date) {
      var m = date.getMonth()
      var d = date.getDate()
      var y = date.getFullYear()
      // for (var $b2 = 0; $b2 < book2.length; $b2++) {
      //   if ($.inArray(y + '-' + (m + 1) + '-' + d, book2) !== -1) {
      //     return [true, 'ui-state-active__n2', '']
      //   }
      // }
      for (var $b1 = 0; $b1 < book1.length; $b1++) {
        if ($.inArray(y + '-' + (m + 1) + '-' + d, book1) !== -1) {
          return [true, 'ui-state-active__n1', '']
        }
      }
      return [true]
    },
    onSelect: function (dateText, inst) {
      console.log('dateText ' + dateText)
      $('.time-select, .sheme--container, .calendar--form').slideUp()
      $('.place').removeClass('place__selected')
      $('.time-select').slideDown()
    }
  })
}

function _selectPlace () {
  $('.time-select--label').click(function () {
    $('.calendar--form').slideUp()
    $('.sheme--container').slideDown()
    $('.place').removeClass('place__selected')
  })
  $('.place').click(function () {
    if ($(this).hasClass('place__booking')) {} else {
      $(this).toggleClass('place__selected')
      $('.place__selected').length !== 0 ? $('.calendar--form').slideDown() : $('.calendar--form').slideUp()
    }
  })
}

function _mobileMenu () {
  $('.burger').click(function () {
    $('.header--nav, .header--login, .header--nav--menu').toggleClass('header__open--nav')
    $(this).toggleClass('burger__open')
  })
}

$(document).ready(
  _calendar(),
  _selectPlace(),
  _mobileMenu()
)
