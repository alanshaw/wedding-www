var Hapi = require('hapi')
var Joi = require('joi')

var server = new Hapi.Server()
server.connection({port: process.env.PORT || 6060})

server.route({
  method: 'POST',
  path: '/rsvp',
  handler: function (req, reply) {
    console.log(req.payload)
    reply.redirect('/thanks.html')
  },
  config: {
    validate: {
      payload: {
        name: Joi.string().trim().required(),
        email: Joi.string().email().required(),
        dietary: Joi.string().trim().allow(''),
        transport: Joi.boolean().required()
      }
    }
  }
})

server.route({
  method: 'GET',
  path: '/{path*}',
  handler: {
    directory: {
      path: "./client",
      listing: false,
      index: true
    }
  }
})

server.start(function () {
  console.log('Server running at:', server.info.uri)
})

