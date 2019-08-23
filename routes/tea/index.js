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
    type: {type: String},
    before: {type: Date, yearsAgo: true, paths: ['dateOfBirth'], operator: '$lte'},
    after: {type: Date, yearsAgo: true, paths: ['dateOfBirth'], operator: '$gte'},
    name: { type: RegExp, paths: ['nameSearch'] }
})

router.get('/:_id', querymen.middleware(), can('tea:get'), 
    asyncHandler(async function (req, res) {
        const doc = await db.findOne({collection: 'user', _id: req.params._id, select: req.querymen.select, filters: req.filters.tea})
        res.json(doc)
    }))

router.get('/', querymen.middleware(querySchema), 
    can('tea:get'), 
    asyncHandler(async function (req, res) {
        const result = await db.find({collection: 'user', ...req.querymen, filters: req.filters.tea})
        res.json(result)
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
        const doc = {...req.body, nameSearch: latinize(req.body.name).toLowerCase()}
        await db.update({collection: 'user', _id: req.params._id, filters: req.filters.tea, doc})
        res.json({})
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