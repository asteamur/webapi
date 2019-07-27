const pick = require('object.pick')
//const equal = require('deep-equal')
const sleep = require('await-sleep')
const { find } = require('./db')

function equal(a, b){
    for(let key of Object.keys(a)){
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
                const r = find(target, req.params.id)
                //await sleep(1000)
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

module.exports = {
    isAllowed,
    isAllowedToResource,
    can
}

//console.log(isAllowed(token, 'user:searchByName'))
//console.log(isAllowedToResource(token, 'userxxx', 'user', 'user:read'))