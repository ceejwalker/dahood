const hapi = require('hapi')
const mongoose = require('mongoose')

const server = hapi.Server({
  port: 4000,
  host: 'localhost'
})

const init = async () => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, response) => {
      return '<h1>My modern api</h1>'
    }
  })
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)

  // Should connect to database
  mongoose.connect('mongodb://localhost:27017/dahood')
}

init()
