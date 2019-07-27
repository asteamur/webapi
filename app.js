const { can } = require('./lib')
const express = require('express')
const jwt = require('express-jwt')

const app = express()

app.use('/private', jwt({secret: 'secret', requestProperty: 'token'}))

app.get('/private/1', can({action: 'user:create'}), function (req, res) {
    res.send('Hello World!');
});

app.get('/private/2/:id', can({target: 'user', action: 'user:memorandum:read'}), function (req, res) {
    res.send('ok!');
});

app.use(function(err, req, res, next) {
    //console.log(JSON.stringify(err))
    if(err.code === 'not-allowed'){
        res.status(401).json({error: err.description})
    }else{
        next(err)
    }
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})