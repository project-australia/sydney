const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const { initialConfigurations } = require('./data/config')
const { router } = require('./presentation/routes')
const ignoreFavicon = require('./presentation/middlewares/ignoreFavIcon')

initialConfigurations()
const app = express()

app.use(ignoreFavicon)
app.disable('x-powered-by')

app.use(cors())

app.use(logger('dev'))
app.use(bodyParser.json({ type: () => true }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(helmet())

app.use(router)

module.exports = app
