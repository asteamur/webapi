const { ValidationError } = require('express-json-validator-middleware')
const { logger } = require('../logger')

module.exports =  function(err, req, res, next) {
    if (err instanceof ValidationError) {
        console.log(err.validationErrors.body)
        logger.error({error: err.validationErrors.body})
        return res.status(403).json({error: 'no valid body'})
    }
    else{
        next(err)
    }
}

