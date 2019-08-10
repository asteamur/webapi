const { ValidationError } = require('express-json-validator-middleware')


module.exports =  function(err, req, res, next) {
    if (err instanceof ValidationError) {
        console.log(err.validationErrors.body)
        return res.json({error: 'no valid body'})
        //status(400).json('invalid');
        //next();
    }
    else{
        next(err)
    }
}

