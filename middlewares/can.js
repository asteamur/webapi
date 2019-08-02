const db = require('../db')
const { ObjectID } = require('mongodb')

function makeError(description){
    const error = new Error()
    error.code = 'not-allowed'
    error.description = description
    return error
}

function includes(a, b){
    for(let key of Object.keys(b)){
        if(Array.isArray(a[key])){
            if(!a[key].includes(b[key])){
                return false
            }
        }else{
            if(a[key] !== b[key]){
                return false
            }
        }
    }
    return true
}

// POST /api/private/memorandum/:_id
const demo = {
    permissions: {
        'user:memorandum:update': {
            tea: { sede: 'A'},
            memorandum: {author: '$user_id' }
        }
    }
}

function can(permission, resources) {
    return async function(req, res, next){
        const p = req.token.permissions[permission]
        if(p === undefined){            
            return next(makeError('has not got permission'))
        }
        if(p === true){
            return next()
        }
        req.filters = p
        req.objs = {}
        let obj = null
        for(let r of resources){
            let _id = null
            if(r._id === '$_id'){
                _id = new ObjectID(req.params._id)                
            }else{
                const [resource, sub_id] = r._id.split('.')
                _id = new ObjectID(req.objs[resource][sub_id])
            }
            obj = await db.get().collection(r.collection).findOne({_id})
            req.objs[r.collection] = obj

            if(!includes(obj, p[r.collection])){
                return next(makeError('filter is not included'))
            }
        }
        return next()
    }
}

module.exports = { can, includes }