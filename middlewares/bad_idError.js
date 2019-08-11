module.exports = function(err, req, res, next) {
    if(err.code === 'bad _id'){
        res.status(400).json({error: err.description})
    }else{
        next(err)
    }
}