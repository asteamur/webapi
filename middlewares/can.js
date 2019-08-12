const db = require('../db')
const { ObjectID } = require('mongodb')
const substitute = require('token-substitute');
const roles = require('../roles')

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
        }else if(Array.isArray(b[key])){
            if(!b[key].includes(a[key])){
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
        'user:memorandum:update': [{
            tea: { sede: 'A'},
            memorandum: {author: '$user_id' }
        }]
    }
}

function hasPermission(permissions, objs){
    let valid = false
    for(let p of permissions){
        for(let key of Object.keys(p)){
            if(!includes(objs[key], p[key])){
                valid = false
                break
            }
            else{
                valid = true
            }
        }
        if(valid){
            return true
        }
    }
    return false
}

function can(permission){
    return function(req, res, next){
        const permissions = roles[req.token.role]
        if(permissions){
            let p = permissions[permission]
            if(p === undefined){            
                return next(makeError('has not got permission'))
            }
            const options = {
                tokens: {
                  'userId': req.token.userId
                }
            }
            p = substitute(p, options)
            req.filters = p
            return next()
        }else{
            const p = req.token.permissions[permission]
            if(p === undefined){            
                return next(makeError('has not got permission'))
            }else{
                req.filters = p
                return next()
            }
        }
    }
}

function _can(permission, resources) {
    return async function(req, res, next){
        const ap = req.token.permissions[permission]
        if(ap === undefined){            
            return next(makeError('has not got permission'))
        }
        if(ap === true){
            return next()
        }
        req.filters = ap
        req.objs = {}
        let obj = null
        let _id = null
        for(let r of resources){
            if(r._id === '$_id'){
                _id = new ObjectID(req.params._id)                
            }else{
                const [resource, sub_id] = r._id.split('.')
                _id = new ObjectID(req.objs[resource][sub_id])
            }
            obj = await db.get().collection(r.collection).findOne({_id})
            req.objs[r.collection] = obj
        }
        if(hasPermission(ap, req.objs)){
            return next()
        }
        else{
            return next(makeError('filter is not included'))
        }
    }
}

module.exports = { can, includes, hasPermission }