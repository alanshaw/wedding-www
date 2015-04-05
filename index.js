var Hapi = require('hapi')
var Joi = require('joi')
var Boom = require('boom')
var levelup = require('levelup')
var nodemailer = require('nodemailer')
var stubTransport = require('nodemailer-stub-transport')
var config = require('rc')('wedding', require('./default-config'))

console.log(config.bride + ' and ' + config.groom)

var server = new Hapi.Server()
server.connection({port: process.env.PORT || 6060})

var db = levelup(process.env.DB_PATH || config.dbPath, {valueEncoding: 'json'})
var mailer = nodemailer.createTransport(config.email || stubTransport())

server.route({
  method: 'POST',
  path: '/rsvp',
  handler: function (req, reply) {
    console.log(req.payload)

    // Save the repsonse
    db.put('rsvp-' + Date.now(), req.payload, function (er) {
      if (er) return reply(Boom.wrap(er, 500, 'Failed to save your RSVP'))
      reply.redirect('/thanks.html')
    })

    // Send notification email
    mailer.sendMail({
      from: config.from,
      to: config.notify,
      subject: 'Wedding RSVP',
      text: Object.keys(req.payload).reduce(function (text, key) {
        var label = key[0].toUpperCase() + key.slice(1)
        var value = req.payload[key]
        return text + label + ': ' + value + '\n'
      }, '')
    }, function (er) {
      if (er) console.error('Failed to send notification email', er)
    })

    // Send thank you email
    mailer.sendMail({
      from: config.from,
      to: req.payload.email,
      subject: 'Thank you for your RSVP',
      text: 'Dear ' + req.payload.name + ',\n\n' +
            'Thank you for your RSVP to ' + config.bride + ' and ' + config.groom + "'s wedding. " +
            'Your response has been received and recorded.\n\n' +
            (req.payload.rsvp ? 
              'Looking forward to seeing you on the day!\n\nThanks again,\n'
              :
              "Sorry to hear you can't make it, thanks for taking the time to reply.\n") +
            config.bride + ' and ' + config.groom
    }, function (er) {
      if (er) console.error('Failed to send thank you email', er)
    })
  },
  config: {
    validate: {
      payload: {
        name: Joi.string().max(80).trim().required(),
        email: Joi.string().email().required(),
        dietary: Joi.string().trim().allow(''),
        comments: Joi.string().trim().allow(''),
        transport: Joi.boolean().required(),
        rsvp: Joi.boolean().required()
      }
    }
  }
})

server.route({
  method: 'GET',
  path: '/crib',
  handler: function (req, reply) {
    reply.redirect('https://alanshaw.github.io/wedding-crib')
  }
})

server.route({
  method: 'GET',
  path: '/{path*}',
  handler: {
    directory: {
      path: "./client"
    }
  }
})

server.start(function () {
  console.log('Server running at:', server.info.uri)
})

