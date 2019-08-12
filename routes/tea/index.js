const {Router} = require('express')
const { ObjectID } = require('mongodb')
const db = require('../../db')
const querymen = require('querymen')
const { can } = require('../../middlewares/can')
const asyncHandler = require('express-async-handler')
const { Validator } = require('express-json-validator-middleware')
const { IdError, AuthError } = require('../../errors')
const { sanitizeQuery, sanitizeSelect } = require('../../lib')
const router = Router()

const validator = new Validator({removeAdditional: true, allErrors: true})
const validate = validator.validate


router.get('/:_id', querymen.middleware(), can('tea:get'), 
    asyncHandler(async function (req, res) {
        let { select } = req.querymen
        select = sanitizeSelect(select)
        let _id = null
        try{
            _id = new ObjectID(req.params._id)
        }catch(err){
            throw(IdError())
        }
        const filters = req.filters 
        query = { _id, ...filters.tea }
        const doc = await db.get().collection('tea').findOne(query, {projection: select})
        if(doc === null){
            throw(AuthError('no tea'))
        }else{
            res.json(doc)    
        }
    }))

router.get('/', querymen.middleware({sede: {type: String}, center: {type: String}}), 
    can('tea:get'), 
    asyncHandler(async function (req, res) {
        let {query, select, cursor} = req.querymen
        query = sanitizeQuery(query)
        select = sanitizeSelect(select)
        const filters = req.filters 
        query = {...query, ...filters.tea}

        const teas = await db.get().collection('tea').find(query, {projection: select}).
            limit(cursor.limit).skip(cursor.skip).sort(cursor.sort).toArray()    
        res.json(teas)
    }))
/*
TeaSchema = {
    additionalProperties: false,
    type: 'object',
    required: ['text'],
    properties: {
        text: {
            type: 'string'
        },
        author: {
            type: 'string'
        },
        tea_id: {
            type: 'string'
        }
    }
}

router.patch('/:_id', can('tea:memorandum:patch'), validate({body: MemorandumSchema}),
    asyncHandler(async function (req, res) {
        let _id = null
        try{
            _id = new ObjectID(req.params._id)
        }catch(err){
            throw(IdError())
            //return res.json({error: 'bad _id'})
        }
        const filters = req.filters 
        query = { _id, ...filters.memorandum }
        const select = {_id: 1}
        const doc = await db.get().collection('memorandum').findOne(query, select)
        if(doc === null){
            throw(AuthError('no memorandum'))
            //res.json({error: 'no memorandum'})
        }else{
            const tea_id = new ObjectID(doc.tea_id)
            const t = await db.get().collection('tea').findOne({_id: tea_id, ...filters.tea})
            
            if(!t){
                throw(AuthError('no tea'))
                //res.json({error: 'no tea'})
            }else{
                await db.get().collection('memorandum').updateOne({_id}, {$set: req.body})
                res.json({})   
            }
        }
    }))

router.post('/', can('tea:memorandum:post'), validate({body: MemorandumSchema}),
    asyncHandler(async function (req, res) {
        let _id = null
        const filters = req.filters 
        const doc = req.body
        try{
            _id = new ObjectID(doc.tea_id)
        }catch(err){
            throw(IdError())
            //return res.json({error: 'bad _id'})
        }
        doc.tea_id = _id
        const t = await db.get().collection('tea').findOne({_id, ...filters.tea})
        if(!t){
            throw(AuthError('no tea'))
            //res.json({error: 'no tea'})
        }else{
            const r = await db.get().collection('memorandum').insertOne(doc)
            res.json({_id: r.insertedId})
        }
    }))
*/
module.exports = router;