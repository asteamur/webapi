const express = require('express')
const jwt = require('express-jwt')
const testRoutes = require('./routes/testing/testPermissions')
const errorCan = require('./middlewares/errorCan')

const app = express()

app.use('/api/private', jwt({secret: 'secret', requestProperty: 'token'}))

app.use('/api/private/testing', testRoutes)

app.use(errorCan)

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})