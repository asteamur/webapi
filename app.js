const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
//const querymen = require('querymen')
require('./formatter')
const memRoutes = require('./routes/memorandum')
const teaRoutes = require('./routes/tea')
const authError = require('./middlewares/authError')
const badIdError = require('./middlewares/bad_idError')
const tokenError = require('./middlewares/tokenError')
const queryError = require('./middlewares/queryError')
//const errorCan = require('./middlewares/errorCan')
const validationError = require('./middlewares/validationError')
const db = require('./db')
const {logger, critialFile} = require('./logger')

const app = express()

//app.use(expressMongoDb(process.env.DB_URI, {useNewUrlParser: true}))

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api/private', jwt({secret: process.env.SECRET, requestProperty: 'token'}))

app.use('/api/private/memorandum', memRoutes)
app.use('/api/private/tea', teaRoutes)
//app.use('/api/private/testing', testRoutes)
//app.use(errorCan)

app.use(tokenError)
app.use(validationError)
app.use(authError)
app.use(badIdError)
app.use(queryError)
//app.use(querymen.errorHandler())

app.use(function(err, req, res, next) {
  console.error(err.stack)
  logger.error({error: err.stack})
  res.status(500).send('Something broke!')
})

db.connect(process.env.DB_URI, {useNewUrlParser: true}, function(err) {
  if (err) {
    critialFile.error('Unable to connect to Mongo.', err)
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      logger.info('Listening on port 3000!')
      console.log('Listening on port 3000!')
    })
  }
})

//app.listen(3000, function () {
//    console.log('Example app listening on port 3000!');
//})