module.exports = function(err, req, res, next) {
    if(err.code === 'not-allowed'){
        res.status(401).json({error: err.description})
    }else{
        next(err)
    }
}
