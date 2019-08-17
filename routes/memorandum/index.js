const {Router} = require('express')
const { ObjectID } = require('mongodb')
const db = require('../../db')
const querymen = require('querymen')
const { can } = require('../../middlewares/can')
const asyncHandler = require('express-async-handler')
//const { Validator } = require('express-json-validator-middleware')
const validate = require('../../validator')
const { IdError, AuthError } = require('../../errors')
const { sanitizeQuery, sanitizeSelect } = require('../../lib')
const router = Router()

//const validator = new Validator({removeAdditional: true, allErrors: true})
//const validate = validator.validate


router.get('/:_id', can('tea:memorandum:get'), 
    asyncHandler(async function (req, res) {
        let _id = null
        try{
            _id = new ObjectID(req.params._id)
        }catch(err){
            throw(IdError('tea:memorandum:get:' + req.params._id))
        }
        const filters = req.filters 
        query = { _id, ...filters.memorandum }
        const select = {_id: 1, text: 1}
        const doc = await db.get().collection('memorandum').findOne(query, select)
        if(doc === null){
            throw(AuthError('no memorandum'))
            //res.json({error: 'no memorandum'})
        }else{
            const tea_id = new ObjectID(doc.tea_id)
            const t = await db.get().collection('user').findOne({_id: tea_id, ...filters.tea})
            
            if(!t){
                throw(AuthError('no tea'))
                //res.json({error: 'no tea'})
            }else{
                res.json(doc)    
            }
        }
    }))

router.get('/', querymen.middleware({tea_id: {type: String}}), 
    can('tea:memorandum:get'), 
    asyncHandler(async function (req, res) {
        let tea_id = null
        try{
            tea_id = new ObjectID(req.query.tea_id)
        }catch(err){
            throw(IdError('tea:memorandum:get:' + req.query.tea_id))
        }
        let {query, select, cursor} = req.querymen
        query = sanitizeQuery(query)
        select = sanitizeSelect(select)

        query.tea_id = tea_id
        const filters = req.filters 
        query = {...query, ...filters.memorandum}

        const p1 = db.get().collection('memorandum').find(query, {projection: select}).
            limit(cursor.limit).skip(cursor.skip).sort(cursor.sort).toArray()    
        const p2 = db.get().collection('user').findOne({_id: tea_id, ...filters.tea})
        const values = await Promise.all([p1, p2])
        if(!values[1]){
            throw(AuthError('no tea'))
            //res.json({error: 'no tea'})
        }else{
            res.json(values[0])    
        }
    }))

MemorandumSchema = {
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
            throw(IdError('tea:memorandum:patch:' + req.params._id))
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
            const t = await db.get().collection('user').findOne({_id: tea_id, ...filters.tea})
            
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
            throw(IdError('tea:memorandum:post:' + doc.tea_id))
        }
        doc.tea_id = _id
        const t = await db.get().collection('user').findOne({_id, ...filters.tea})
        if(!t){
            throw(AuthError('no tea'))
        }else{
            const r = await db.get().collection('memorandum').insertOne(doc)
            res.json({_id: r.insertedId})
        }
    }))

module.exports = router;