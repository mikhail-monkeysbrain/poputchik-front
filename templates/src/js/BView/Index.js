app.ns('app.views').Index = app.core.Page.extend({

  events: {
  },

  behaviors: [
    // 'Behavior1'
  ],

  subView: {
    // subView1: 'subView1'
  },

  initialize: function () {
    app.views.Index.__super__.initialize.apply(this, arguments)
  },

  remove: function () {
    app.views.Index.__super__.remove.apply(this, arguments)
  },

  render: function () {
    app.views.Index.__super__.render.apply(this, arguments)

    app.views.Index.__super__.afterRender.apply(this, arguments)
  }
})

function _calendar () {
  var book1 = ['2019-1-21', '2019-1-24', '2019-1-27', '2019-1-29']
  var book2 = ['2019-1-21', '2019-1-24']
  var book3 = ['2019-1-21']
  var book4 = ['2019-2-1']
  var book5 = ['2019-2-4']
  var book6 = ['2019-2-5']
  var book7 = ['2019-2-21']
  $('.datepicker').datepicker({
    numberOfMonths: 3,
    language: 'ru',
    minDate: 0,
    beforeShowDay: function (date) {
      var m = date.getMonth()
      var d = date.getDate()
      var y = date.getFullYear()
      for (var $b7 = 0; $b7 < book7.length; $b7++) {
        if ($.inArray(y + '-' + (m + 1) + '-' + d, book7) !== -1) {
          return [true, 'ui-state-active__n7', '']
        }
      }
      for (var $b6 = 0; $b6 < book6.length; $b6++) {
        if ($.inArray(y + '-' + (m + 1) + '-' + d, book6) !== -1) {
          return [true, 'ui-state-active__n6', '']
        }
      }
      for (var $b5 = 0; $b5 < book5.length; $b5++) {
        if ($.inArray(y + '-' + (m + 1) + '-' + d, book5) !== -1) {
          return [true, 'ui-state-active__n5', '']
        }
      }
      for (var $b4 = 0; $b4 < book4.length; $b4++) {
        if ($.inArray(y + '-' + (m + 1) + '-' + d, book4) !== -1) {
          return [true, 'ui-state-active__n4', '']
        }
      }
      for (var $b3 = 0; $b3 < book3.length; $b3++) {
        if ($.inArray(y + '-' + (m + 1) + '-' + d, book3) !== -1) {
          return [true, 'ui-state-active__n3', '']
        }
      }
      for (var $b2 = 0; $b2 < book2.length; $b2++) {
        if ($.inArray(y + '-' + (m + 1) + '-' + d, book2) !== -1) {
          return [true, 'ui-state-active__n2', '']
        }
      }
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

$(document).ready(
  _calendar(),
  _selectPlace()
)
