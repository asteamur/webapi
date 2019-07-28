const express = require('express')
//const bodyParser = require('body-parser')
const jwt = require('express-jwt')
//const expressMongoDb = require('express-mongo-db')
const testRoutes = require('./routes/testing/testPermissions')
const errorCan = require('./middlewares/errorCan')
const db = require('./db')

const app = express()

//app.use(expressMongoDb(process.env.DB_URI, {useNewUrlParser: true}))

app.use('/api/private', jwt({secret: process.env.SECRET, requestProperty: 'token'}))

app.use('/api/private/testing', testRoutes)

app.use(errorCan)

db.connect(process.env.DB_URI, {useNewUrlParser: true}, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000!')
    })
  }
})

//app.listen(3000, function () {
//    console.log('Example app listening on port 3000!');
//})