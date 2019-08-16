var jwt = require('jsonwebtoken')

var token = {
    userId: 'miguel',
    role: 'admin'
}

console.log(jwt.sign(token, 'secret'))

