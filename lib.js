function sanitizeQuery(query){

    return query
}

function sanitizeSelect(select){
    return Object.keys(select).reduce((obj, k)=>{
        if(select[k] === 1 && k !== 'password'){
            obj[k] = 1
        }
        return obj
    }, {})
}

module.exports = { sanitizeQuery, sanitizeSelect }