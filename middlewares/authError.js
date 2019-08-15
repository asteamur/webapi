const { logger } = require('../logger')

module.exports = function(err, req, res, next) {
    if(err.code === 'not-allowed'){
        logger.error({error: err.description})
        res.status(401).json({error: err.description})
    }else{
        next(err)
    }
}