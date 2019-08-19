module.exports = function (err, req, res, next) {
    if (req.querymen && req.querymen.error) {
      res.status(400).json(req.querymen)
    } else {
      next(err)
    }
}