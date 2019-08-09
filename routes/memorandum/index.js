const {Router} = require('express')
const { ObjectID } = require('mongodb')
const db = require('../../db')
const querymen = require('querymen')
const { can } = require('../../middlewares/can')
const asyncHandler = require('express-async-handler')

const router = Router()

router.get('/', querymen.middleware({tea_id: {type: String}, namespace: {type: String}}), 
    can('tea:memorandum:find'), 
    asyncHandler(async function (req, res) {
        const tea_id = new ObjectID(req.query.tea_id)
        let {query, select, cursor} = req.querymen
        query.tea_id = tea_id
        const filters = req.filters 
        query = {...query, ...filters.memorandum}

        const p1 = db.get().collection('memorandum').find(query, select).
            limit(cursor.limit).skip(cursor.skip).sort(cursor.sort).toArray()    
        const p2 = db.get().collection('tea').findOne({_id: tea_id, ...filters.tea})
        const values = await Promise.all([p1, p2])
        if(!values[1]){
            res.json({error: 'no tea'})
        }else{
            res.json(values[0])    
        }
    }))

module.exports = router;