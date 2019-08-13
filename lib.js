const sanitize = require('mongo-sanitize')

function sanitizeQuery(query){
    return sanitize(query)
}

function sanitizeSelect(select){
    return Object.keys(select).reduce((obj, k)=>{
        if(select[k] === 1 && k !== 'password'){
            obj[k] = 1
        }
        return obj
    }, {_id: 1})
}

module.exports = { sanitizeQuery, sanitizeSelect }