const pick = require('object.pick')
const db = require('../db')
const { ObjectID } = require('mongodb')

function equal(a, b){
    //if(!a.every((x)=> b.includes(x)) || !b.every((x)=> a.includes(x))){
    //    return false
    //}
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

function can({action, target=null}){
    if(target === null){
        return function(req, res, next){
            if(isAllowed(req.token, action)){
                next()
            }else{
                const error = new Error()
                error.code = 'not-allowed'
                error.description = 'can not access. Action: ' + action
                next(error)
            }
        }
    }else{
        return async function(req, res, next){
            try{
                const _id = new ObjectID(req.params.id)
                const r = await db.get().collection('users').findOne({_id})
                if(isAllowedToResource(req.token, target, r, action)){
                    next()
                }else{
                    const error = new Error()
                    error.code = 'not-allowed'
                    error.description = 'can not access. Action: ' + action + '. Target: ' + target
                    next(error)
                }
            }catch(err){
                next(err)
            }
        }
    }
}
   
function isAllowed(token, permission) {
    for (let p of token.allow) {
        if(p.resource === '*'){
            if(p.permissions.includes(permission)){
                return true
            }
        }
    }
    return false
}

function isAllowedToResource(token, resourceName, resource, permission) {
    for (let x of token.allow) {
        if(x.resource === resourceName){
            for(let p of x.permissions){
                if(p.permission === permission){
                    if(p.filter === undefined){
                        return true
                    }
                    if (equal(pick(resource, Object.keys(p.filter)), p.filter)){
                        return true
                    }
                }
            }
        }
    }
    return false
}

module.exports = { can, equal, isAllowed, isAllowedToResource }
