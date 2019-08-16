const { logger } = require('../logger')

module.exports = function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        logger.error({error: err.code, description: err.description})      
        res.status(401).json({error: err.name + ':' + err.message});
    }else{
        next(err)
    }
}