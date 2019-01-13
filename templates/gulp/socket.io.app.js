$(function () {
  var url = $('base').attr('href').match(/[^:]*:\/\/[^\/]*/)[0]
  var socket = io([url, ':', port, '/'].join(''), {
    'force new connection': true,
    'reconnectionAttempts': 'Infinity', // avoid having user reconnect manually in order to prevent dead clients after a server restart
    'timeout': 10000, // before connect_error and connect_timeout are emitted.
    'transports': ['websocket']
  })
  socket.on('connect', function (target) {
    console.log('connect socket', arguments)
    // devHelper();
  })
  socket.on('update', function (target) {
    console.log('update', target)
    switch (target) {
      case 'less':
      case 'scss':
      case 'styl':
        var $styles = $('link[href*="/styles.css"]'),
          href = $styles.attr('href'),
          regExp = /\d+$/,
          $newStyles
        if (regExp.test(href)) {
          href = href.replace(regExp, function (match) { return parseInt(match) + 1 })
        } else {
          href += '?v=2'
        }
        $newStyles = $('<link>')
        $newStyles.attr({
          href: href,
          rel: 'stylesheet'
        })
        $newStyles.on('load', function () {
          $styles.remove()
        })
        $('head').append($newStyles)
    }
  })
  function devHelper() {
    // Чтобы видеть размеры, как в макете
    $('head').append('<style>html {font-size: 10px!important}</style>')
    // Чтобы видосы не мешали
    $('video').remove()
  }
})
