var $ = window.jQuery = require('jquery')

require('./jquery.mmenu.js')
require('./jquery.validate.js')

function validate (selector, opts) {
  opts = opts || {}
  $(selector).validate($.extend({
    highlight: function (el) {
      $(el).closest('.form-group').addClass('has-error')
    },
    unhighlight: function (el) {
      $(el).closest('.form-group').removeClass('has-error')
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function (err, el) {
      if (el.parent('.input-group').length || el.is('[type=radio]')) {
        err.insertAfter(el.parent())
      } else {
        err.insertAfter(el)
      }
    }
  }, opts))
}

validate('#rsvp-form')

$('#rsvp-submit-no').click(function () {
  $('#rsvp-transport-no').click()
})

var menu = $('#menu')

menu.mmenu({
  classes: "mm-light",
  dragOpen: true,
  offCanvas: {position: "right"},
  header: {add: true, update: true, title: 'Lizzy &amp; Alan'}
})

menu.find('li > a').on('click', function (e) {
  var href = $(this).attr('href')

  if (href.slice(0, 1) != '#') return

  menu.one('closed.mm', function () {
    setTimeout(function () {
      $('html, body').animate({scrollTop: $(href).offset().top})
    }, 10)
  })
})

// Load the iframes after the rest of the document has loaded
$(document).ready(function () {
  console.log($('iframe').size())
  $('iframe').each(function () {
    var iframe = $(this)
    console.log(iframe.data('src'))
    iframe.attr('src', iframe.data('src'))
  })
})