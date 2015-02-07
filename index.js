var Hapi = require('hapi')

var server = new Hapi.Server()
server.connection({port: process.env.PORT || 6060})

/*server.route({
  method: 'POST',
  path: '/register',
  handler: handlers.register.create,
  config: {
    // TODO: Add payload validation
  }
})*/

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

