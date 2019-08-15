const { logger } = require('../logger')

module.exports = function(err, req, res, next) {
    if(err.code === 'bad _id'){
        logger.error({error: err.code, description: err.description})
        res.status(400).json({error: err.code})
    }else{
        next(err)
    }
}