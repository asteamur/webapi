module.exports = function(err, req, res, next) {
    if(err.code === 'not-allowed'){
        res.json({error: err.description})
    }else{
        next(err)
    }
}
