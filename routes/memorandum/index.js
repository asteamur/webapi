const {Router} = require('express')
const { ObjectID } = require('mongodb')
const db = require('../../db')
const querymen = require('querymen')
const { can } = require('../../middlewares/can')
const asyncHandler = require('express-async-handler')
const { Schema } = require('querymen')
const validate = require('../../validator')
const { IdError, AuthError } = require('../../errors')
const { sanitizeQuery, sanitizeSelect } = require('../../lib')
const router = Router()


const querySchema = new Schema({
    tea_id: {type: String},
    before: {type: Date, paths: ['createdAt'], operator: '$lte'},
    after: {type: Date, paths: ['createdAt'], operator: '$lte'},
    since: {type: Date, paths: ['createdAt'], daysAgo: true, operator: '$gte'}
})

router.get('/:_id', querymen.middleware(), can('tea:memorandum:get'), 
    asyncHandler(async function (req, res) {
        const doc = await db.findOne({collection: 'memorandum', _id: req.params._id, select: req.querymen.select, filters: req.filters.memorandum})
        if(doc === null){
            throw(AuthError('no memorandum'))
        }
        const tea_id = new ObjectID(doc.tea_id)
        const user = await db.findOne({collection: 'user', _id: tea_id, select: {_id: 1}, filters: req.filters.tea})
        if(user === null){
            throw(AuthError('no tea'))
        }
        res.json(doc)
    }))

router.get('/', querymen.middleware(querySchema), 
    can('tea:memorandum:get'), 
    asyncHandler(async function (req, res) {
        await db.findOne({collection: 'user', _id: req.query.tea_id, select: {_id: 1}, filters: req.filters.tea})
        let {query, select, cursor} = req.querymen
        query = {...query, tea_id: new ObjectID(req.query.tea_id)}
        const result = await db.find({collection: 'memorandum', query, select, cursor, filters: req.filters.memorandum})
        res.json(result)
    }))

MemorandumSchema = {
    additionalProperties: false,
    type: 'object',
    required: ['text'],
    properties: {
        text: {
            type: 'string'
        },
        //author: {
        //    type: 'string'
        //},
        tea_id: {
            type: 'string'
        }
    }
}

router.patch('/:_id', can('tea:memorandum:patch'), validate({body: MemorandumSchema}),
    asyncHandler(async function (req, res) {
        await db.findOne({collection: 'memorandum', _id: req.params._id, select: {_id: 1}, filters: req.filters.memorandum})
        const doc = {...req.body, updatedAt: new Date(), updatedBy: req.token.userId}
        await db.update({collection: 'memorandum', _id: req.params._id, filters: req.filters.memorandum, doc})
        res.json({})
    }))

router.post('/', can('tea:memorandum:post'), validate({body: MemorandumSchema}),
    asyncHandler(async function (req, res) {
        const doc = req.body        
        await db.findOne({collection: 'user', _id: doc.tea_id, select: {_id: 1}, filters: req.filters.tea})
        doc.tea_id = new ObjectID(doc.tea_id)
        doc.createdBy = req.token.userId
        doc.createdAt = new Date()
        const r = await db.get().collection('memorandum').insertOne(doc)
        res.json({_id: r.insertedId, createdBy: req.token.userId})
    }))

module.exports = router;