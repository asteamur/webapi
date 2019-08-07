const {Router} = require('express')
const { can } = require('../../middlewares/can')
const { can2, find } = require('../../middlewares/can2')

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

router.get('/4/', can2('tea:memorandum:patch'), find('memorandum', {
    memorandum: {'*': '$query'},
    tea: {'_id': '$query.tea_id'}
}), function (req, res) {
    res.json(req.objects || []);
}
)

module.exports = router;