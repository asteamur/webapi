const {Router} = require('express')
const { ObjectID } = require('mongodb')
const db = require('../../db')
const querymen = require('querymen')
const { Schema } = require('querymen')
const { can } = require('../../middlewares/can')
const asyncHandler = require('express-async-handler')
const validate = require('../../validator')
const { IdError, AuthError } = require('../../errors')
const { sanitizeQuery, sanitizeSelect } = require('../../lib')
const latinize = require('latinize')

const router = Router()

const querySchema = new Schema({
    sede: {type: [String]}, 
    center: {type: [String]},
    before: {type: Date, yearsAgo: true, paths: ['dateOfBirth'], operator: '$lte'},
    after: {type: Date, yearsAgo: true, paths: ['dateOfBirth'], operator: '$gte'},
    name: { type: RegExp, paths: ['nameSearch'] }
})

router.get('/:_id', querymen.middleware(), can('tea:get'), 
    asyncHandler(async function (req, res) {
        let { select } = req.querymen
        select = sanitizeSelect(select)
        let _id = null
        try{
            _id = new ObjectID(req.params._id)
        }catch(err){
            throw(IdError('tea:get:' + req.params._id))
        }
        const filters = req.filters 
        query = { _id, ...filters.tea, type: 'tea' }
        const doc = await db.get().collection('user').findOne(query, {projection: select})
        if(doc === null){
            throw(AuthError('no tea'))
        }else{
            res.json(doc)    
        }
    }))

router.get('/', querymen.middleware(querySchema), 
    can('tea:get'), 
    asyncHandler(async function (req, res) {
        let {query, select, cursor} = req.querymen
        query = sanitizeQuery(query)
        select = sanitizeSelect(select)
        const filters = req.filters 
        query = {...query, ...filters.tea, type: 'tea'}

        const teas = await db.get().collection('user').find(query, {projection: select}).
            limit(cursor.limit).skip(cursor.skip).sort(cursor.sort).toArray()    
        res.json(teas)
    }))


TeaSchema = {
    additionalProperties: false,
    type: 'object',
    required: ['name'],
    properties: {
        name: {
            type: 'string'
        },
        dateOfBirth: {
            type: 'string',
            date: true
        },
        email: {
            type: 'string'
        }
    }
}

router.patch('/:_id', can('tea:patch'), validate({body: TeaSchema}),
    asyncHandler(async function (req, res) {
        let _id = null
        try{
            _id = new ObjectID(req.params._id)
        }catch(err){
            throw(IdError('tea:patch:' + req.params._id))
        }
        const filters = req.filters 
        query = { _id , ...filters.tea, type: 'tea' }
        
        const t = await db.get().collection('user').findOne(query)    
        if(!t){
            throw(AuthError('no tea'))
        }else{
            const doc = {...req.body, nameSearch: latinize(req.body.name).toLowerCase()}
            await db.get().collection('user').updateOne({_id}, {$set: doc})
            res.json({})   
        }
    }))

router.post('/', can('tea:post'), validate({body: TeaSchema}),
    asyncHandler(async function (req, res) {
        const doc = req.body
        doc.type = 'tea'
        doc.nameSearch = latinize(doc.name).toLocaleLowerCase()
        const r = await db.get().collection('user').insertOne(doc)
        res.json({_id: r.insertedId})        
    })
)

    
module.exports = router;