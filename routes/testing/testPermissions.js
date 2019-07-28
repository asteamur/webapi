const {Router} = require('express')
const can = require('../../middlewares/can')

const router = Router()

router.get('/1', can({action: 'user:create'}), function (req, res) {
    res.send('Hello World!');
});

router.get('/2/:id', can({target: 'user', action: 'user:memorandum:read'}), function (req, res) {
    res.send('ok!');
});

module.exports = router;