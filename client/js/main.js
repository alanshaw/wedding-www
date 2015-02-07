var $ = window.jQuery = require('jquery')
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