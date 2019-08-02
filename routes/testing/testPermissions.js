const {Router} = require('express')
const { can } = require('../../middlewares/can')

const router = Router()

router.get('/3/:_id', can('user:memorandum:update', [
        {
            collection: 'memorandum',
            _id: '$_id'
        },
        {
            collection: 'tea',
            _id: 'memorandum.tea_id'
        }
    ]), function (req, res) {
        res.send('ok!');
    }
);

module.exports = router;