const hapi = require('hapi')
const mongoose = require('mongoose')
const Painting = require('./models/Painting')
const chalk = require('chalk')

const server = hapi.Server({
  port: 4000,
  host: 'localhost'
})

const init = async () => {
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
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)

  // Should connect to database
  mongoose.connect('mongodb://localhost:27017/dahood').then(
    () => { console.log(chalk.blue('Mongoose sniffed out the database!')) },
    err => { console.log(chalk.red(err)) }
  )
}

init()
