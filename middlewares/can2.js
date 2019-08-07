//const arrToObj = require('array-to-object')
const { ObjectID } = require('mongodb')
const db = require('../db')

//const db = {}

function isObject(obj) {
    return obj === Object(obj);
}

/*
db.collection = (coll) => {
    return {
        find(query, select, cursor){
            return {query, select, cursor}
        },
        findOne(query){
            return {query}
        }
    }
}
*/

function arrToObj (array, values) {
    if (!Array.isArray(array) || !Array.isArray(values)) {
      return
    }
  
    var res = {}
  
    array.forEach(function (ele) {
      if (!values.length) {
        return
      }
      res[ele] = values.shift()
    })
  
    return res
}

function fetch(coll, ref, req, previous){
    if(ref['*']){
        //query.tea_id debe ser ObjectId. Si no se puede hacer por querymen, entonces
        //hay que pasar aquí un parámetros objectIds array ['tea_id']
        //o si termina en _id convertirlo a ObjectId
        
        //let {select, query, cursor} = req.querymen
        let query = {tea_id: new ObjectID(req.query.tea_id), namespace: 'xxx'}
        query = {...query, ... req.filters[coll]}
        
        //sanitize query
        return db.get().collection(coll).find(query).toArray() //, select, cursor)
    }else if(ref['_id']){
        //const patt = /^(.+)\.(.+)$/
        //const match = patt.exec(ref['_id'])
        const [source, att] = ref['_id'].split('.')
        let value = null
        switch (source) {
            case '$params':
                value = new ObjectID(req.params[att])
                break
            case '$query':
                value = new ObjectID(req.query[att])
                break
            case '$body':
                value = new ObjectID(req.body[att])
                break
            default:
                value = previous[source][att]
                break
        }
        return db.get().collection(coll).findOne({_id: value, ...req.filters[coll]})
    }
    //raise error
}

async function fetchMany(instructions, req){
    const keys = Object.keys(instructions)
    if(isObject(instructions)){
        //parallel
        const values = await Promise.all(keys.map((key) => fetch(key, instructions[key], req)))
        return arrToObj([...keys], [...values])
    }else{//seq
        const objects = {}
        for(let k of keys){
            objects[k] = await fetch(k, instructions[k], req, objects)
        }
        return objects
    }
}

function can2(permission) {
    return function(req, res, next){
        try{
            req.filters = req.token.permissions[permission]
            next()
        }catch{
            next(new Error('error con el token'))
        }
    }
}

function find(collection, instructions) {
    return async function(req, res, next){
        try{    
            const objs = await fetchMany(instructions, req)
            console.log('=================>', objs)
            if(Object.values(objs).includes(null)){
                req.objects = null
            }else{
                req.objects = objs[collection]
            }
            next()
        }catch{
            next(new Error('error en middleware find'))
        }
    }
}

module.exports = {fetchMany, can2, find}

/*
router.get('/memorandum').queryRequired(['tea_id']).can('user:memorandum:find').find(
    'memorandum',
    {   // parallel
        memorandum: {'*': '$query'},
        tea: {'_id': '$query.tea_id'}
    }
){
    return req.objects.memorandum
}

router.get('/memorandum/:_id').can('user:memorandum:find').findOne(
    [   // seq
        {memorandum: {'_id': '$params._id'}},
        {tea: {'_id': 'memorandum.tea_id'}}
    ]
){
    return req.objects.memorandum
}

router.post('/tea').can('user:memorandum:post').post(
    {  // or []
        tea: '_id = $body.tea_id'
    }
)

router.patch('/tea/:_id').can('user:memorandum:patch').patch(
    {  // or []
        tea: '_id = $params._id'
    }
)

*/