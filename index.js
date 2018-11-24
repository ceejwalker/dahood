// Imports
const hapi = require('hapi')
const mongoose = require('mongoose')
const Painting = require('./models/Painting')
const chalk = require('chalk')
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi')
const schema = require('./graphql/schema')

// Server creation and options
const server = hapi.Server({
  port: 4000,
  host: 'localhost'
})

// Server logic
const init = async () => {

  // Plugins
  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/gql'
      }
    }
  })

  // Routes
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (request, response) => {
        return '<h1>My modern api</h1>'
      }
    },
    {
      method: 'GET',
      path: '/api/v1/paintings',
      handler: (req, reply) => {
        return Painting.find()
      }
    },
    {
      method: 'POST',
      path: '/api/v1/paintings',
      handler: (req, reply) => {
        if (req) {
          const { name, url, techniques } = req.payload
          const painting = new Painting({
            name,
            url,
            techniques
          })

          return painting.save()
        }
      }
    }
  ])

  // starts the server
  try {
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
  } catch (err) {
    console.log(`Error while starting server: ${err.message}`)
  }

  // Connects to existing mongo db
  mongoose.connect('mongodb://localhost:27017/dahood').then(
    () => { console.log(chalk.blue('Mongoose sniffed out the database!')) },
    err => { console.log(chalk.red(err)) }
  )
}

// Triggers the init
init()
